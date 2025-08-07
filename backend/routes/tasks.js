const express = require('express');
const router = express.Router();
const path = require('path'); // Added for file path handling

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

const { verifyToken, checkRole, checkManagerTaskAccess } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create Task - Admin or Manager
router.post('/', verifyToken, checkRole('Admin', 'Manager'), createTask);

// Get All Tasks - Admin only
router.get('/', verifyToken, checkRole('Admin'), getAllTasks);

// Get My Tasks - Team Member
router.get('/my-tasks', verifyToken, checkRole('Team Member'), getMyTasks);

// Get Manager's Project Tasks (all tasks from projects they are assigned to)
router.get('/manager-tasks', verifyToken, checkRole('Manager'), async (req, res) => {
  try {
    const Task = require('../models/Task');
    const Project = require('../models/Project');
    
    // First get all projects the manager is assigned to (as team member or project manager)
    const assignedProjects = await Project.find({
      $or: [
        { teamMembers: req.user.id },
        { projectManager: req.user.id }
      ]
    });
    const projectIds = assignedProjects.map(project => project._id);
    
    // Then get all tasks from those projects
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch manager tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get Manager's Project-Specific Tasks
router.get('/manager-project/:projectId', verifyToken, checkRole('Manager'), async (req, res) => {
  try {
    const Task = require('../models/Task');
    const Project = require('../models/Project');
    
    // Check if manager is assigned to this project (as team member or project manager)
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const isAssigned = project.teamMembers?.includes(req.user.id) || 
                      project.projectManager?.toString() === req.user.id;
    
    if (!isAssigned) {
      return res.status(403).json({ error: 'Access denied. You are not assigned to this project.' });
    }
    
    // Get all tasks from this project
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
    
    res.json(tasks);
  } catch (err) {
    console.error('Failed to fetch manager project tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get project-specific tasks assigned to the team member
router.get('/project/:projectId/user', verifyToken, checkRole('Team Member'), getMyProjectTasks);

// Get Tasks for Calendar View - Any logged-in user
router.get('/calendar/tasks', verifyToken, getTasksByDueDate);

// Download Task Attachment - Any logged-in user
router.get('/:id/attachments/:attachmentId/download', verifyToken, async (req, res) => {
  const Task = require('../models/Task');
  const { id, attachmentId } = req.params;

  console.log('Download request:', { id, attachmentId, user: req.user.id });

  try {
    const task = await Task.findById(id);
    if (!task) {
      console.log('Task not found:', id);
      return res.status(404).json({ error: 'Task not found' });
    }

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      console.log('Attachment not found:', attachmentId, 'in task:', id);
      return res.status(404).json({ error: 'Attachment not found' });
    }

    console.log('Attachment found:', attachment);

    // If using Cloudinary or external URL, redirect to the file URL
    if (attachment.path.startsWith('http')) {
      console.log('Redirecting to external URL:', attachment.path);
      return res.redirect(attachment.path);
    }

    // If using local storage, serve the file
    const filePath = path.join(__dirname, '..', attachment.path);
    console.log('Local file path:', filePath);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      console.log('File not found on server:', filePath);
      return res.status(404).json({ error: 'File not found on server' });
    }

    console.log('Serving file:', filePath);
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(filePath);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Preview Task Attachment - Any logged-in user (without download headers)
router.get('/:id/attachments/:attachmentId/preview', verifyToken, async (req, res) => {
  const Task = require('../models/Task');
  const { id, attachmentId } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

    // If using Cloudinary or external URL, redirect to the file URL
    if (attachment.path.startsWith('http')) {
      return res.redirect(attachment.path);
    }

    // If using local storage, serve the file
    const filePath = path.join(__dirname, '..', attachment.path);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Set appropriate content type for preview (no download headers)
    const extension = attachment.filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      contentType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    } else if (extension === 'pdf') {
      contentType = 'application/pdf';
    } else if (extension === 'txt') {
      contentType = 'text/plain';
    }

    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Preview failed' });
  }
});

// Delete Task Attachment - Admin only
router.delete('/:id/attachments/:attachmentId', verifyToken, checkRole('Admin'), async (req, res) => {
  const Task = require('../models/Task');
  const { id, attachmentId } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

    // Remove the attachment from the array
    task.attachments.pull(attachmentId);
    await task.save();

    res.json({ message: 'Attachment deleted successfully' });
  } catch (err) {
    console.error('Delete attachment error:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Get Task by ID - Any logged-in user
router.get('/:id', verifyToken, getTaskById);

// Update Task - Admin or Manager (if assigned to project)
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), checkManagerTaskAccess, updateTask);

// Delete Task - Admin or Manager (if assigned to project)
router.delete('/:id', verifyToken, checkRole('Admin', 'Manager'), checkManagerTaskAccess, deleteTask);

// Add Comment to Task - Any logged-in user
router.post('/:id/comments', verifyToken, addCommentToTask);

// Upload File to Task - Any logged-in user
router.post('/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
  const Task = require('../models/Task');

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newAttachment = {
      _id: new require('mongoose').Types.ObjectId(),
      filename: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date()
    };

    task.attachments.push(newAttachment);
    await task.save();
    
    console.log('File uploaded:', newAttachment);
    res.status(200).json({ message: 'File uploaded', file: newAttachment });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
