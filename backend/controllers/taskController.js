const Task = require('../models/Task');

// Create Task
const createTask = async (req, res) => {
  const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

  try {
    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      dueDate,
    });

    await task.save();
    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Error creating task' });
  }
};

// Get all tasks (Admin/Manager)
const getAllTasks = async (req, res) => {
  try {
    const query = {};
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email role');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};


// Get tasks assigned to logged-in user
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('project', 'name')
      .populate('assignedTo', 'name'); 

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your tasks' });
  }
};


const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email role')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email',
        },
      });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Error fetching task' });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    attachments,
  } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update basic fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    // Attachments (overwrite only if present)
    if (attachments && Array.isArray(attachments)) {
      task.attachments = attachments; // must be array of { filename, path }
    }

    await task.save();

    res.json({ message: "Task updated", task });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Error updating task" });
  }
};


// Delete Task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};

const addCommentToTask = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newComment = {
      text,
      author: req.user.id,
      createdAt: new Date(),
    };

    task.comments.push(newComment);
    await task.save();

    const updatedTask = await Task.findById(id).populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'name email',
      },
    });

    const lastComment = updatedTask.comments.at(-1);
    res.status(200).json(lastComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

const getTasksByDueDate = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'Team Member') {
      // Show only tasks assigned to the logged-in Team Member
      tasks = await Task.find({ assignedTo: req.user.id }, 'title dueDate status')
        .populate('project', 'name')
        .populate('assignedTo', 'name');
    } else {
      // Admin/Manager can see all tasks
      tasks = await Task.find({}, 'title dueDate status')
        .populate('project', 'name')
        .populate('assignedTo', 'name');
    }

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching calendar tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks for calendar' });
  }
};

const getMyProjectTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await Task.find({
      project: projectId,
      assignedTo: req.user.id,
    }).populate('assignedTo', 'name');

    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching member's project tasks:", err);
    res.status(500).json({ error: 'Failed to fetch your assigned tasks for this project' });
  }
};

const uploadTaskFile = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const fileData = {
      filename: req.file.originalname,
      path: req.file.path, // Cloudinary URL
    };

    task.attachments.push(fileData);
    await task.save();

    res.status(200).json({ message: 'File uploaded and attached', file: fileData });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }
};



module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addCommentToTask,
  getTasksByDueDate,
  getMyProjectTasks,
  uploadTaskFile
};
