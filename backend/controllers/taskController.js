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
      dueDate
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
    const tasks = await Task.find()
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
    const tasks = await Task.find({ assignedTo: req.user.id }).populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching your tasks' });
  }
};

// Update Task
const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Task updated', task: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error updating task' });
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
  const { id } = req.params; // task ID
  const { text } = req.body;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.comments.push({
      user: req.user.id,
      text
    });

    await task.save();
    res.status(200).json({ message: 'Comment added', comments: task.comments });
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

const getTasksByDueDate = async (req, res) => {
  try {
    const tasks = await Task.find({}, 'title dueDate status')
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    res.json(tasks);
  } catch (err) {
    console.error('Error fetching calendar tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks for calendar' });
  }
};


module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  addCommentToTask,
  getTasksByDueDate
};



