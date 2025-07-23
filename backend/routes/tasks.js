const express = require('express');
const router = express.Router();

const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addCommentToTask,
  getTasksByDueDate,
  getMyProjectTasks,
  uploadTaskFile,
} = require('../controllers/taskController');

const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Task - Admin or Manager
router.post('/', verifyToken, checkRole('Admin', 'Manager'), createTask);

// Get All Tasks - Admin or Manager
router.get('/', verifyToken, checkRole('Admin', 'Manager'), getAllTasks);

// Get My Tasks - Team Member
router.get('/my-tasks', verifyToken, checkRole('Team Member'), getMyTasks);

// Get project-specific tasks assigned to the team member
router.get('/project/:projectId/user', verifyToken, checkRole('Team Member'), getMyProjectTasks);

// Get Tasks for Calendar View - Any logged-in user
router.get('/calendar/tasks', verifyToken, getTasksByDueDate);

// Get Task by ID - Any logged-in user
router.get('/:id', verifyToken, getTaskById);

// Update Task - Admin or Manager
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), updateTask);

// Delete Task - Admin or Manager
router.delete('/:id', verifyToken, checkRole('Admin', 'Manager'), deleteTask);

// Add Comment to Task - Any logged-in user
router.post('/:id/comments', verifyToken, addCommentToTask);

router.post('/:id/upload', verifyToken, upload.single('file'), uploadTaskFile);


// Upload File to Task - Any logged-in user
router.post('/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
  const Task = require('../models/Task');

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.attachments.push({
      filename: req.file.originalname,
      path: req.file.path,
    });

    await task.save();
    res.status(200).json({ message: 'File uploaded', file: req.file });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
