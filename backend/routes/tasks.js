const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  addCommentToTask,
  getTasksByDueDate
} = require('../controllers/taskController');

const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Task = require('../models/Task');

// Create Task - Admin or Manager
router.post('/', verifyToken, checkRole('Admin', 'Manager'), createTask);

// Get All Tasks - Admin or Manager (with assignedTo populated)
router.get('/', verifyToken, checkRole('Admin', 'Manager'), async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch tasks', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get My Tasks - Team Member (with assignedTo populated)
router.get('/my-tasks', verifyToken, checkRole('Team Member'), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch my tasks', err);
    res.status(500).json({ error: 'Failed to fetch my tasks' });
  }
});

// Get Task by ID - Any logged-in user
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// Update Task - Admin or Manager
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), updateTask);

// Delete Task - Admin or Manager
router.delete('/:id', verifyToken, checkRole('Admin', 'Manager'), deleteTask);

// Add Comment to Task - Any logged-in user
router.post('/:id/comments', verifyToken, addCommentToTask);

// Get Tasks for Calendar View - Any logged-in user
router.get('/calendar/tasks', verifyToken, getTasksByDueDate);

// Upload File to Task - Any logged-in user
router.post('/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.attachments.push({
      filename: req.file.originalname,
      path: req.file.path
    });

    await task.save();
    res.status(200).json({ message: 'File uploaded', file: req.file });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
