const express = require('express');
const router = express.Router();
const path = require('path'); // Added for file path handling
const multer = require('multer');
const { put } = require("@vercel/blob");
const mongoose = require('mongoose');

const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addCommentToTask,
  deleteTaskComment,
  getTasksByDueDate,
  getMyProjectTasks,
  uploadTaskFile,
} = require('../controllers/taskController');

const { verifyToken, checkRole, checkManagerTaskAccess } = require('../middleware/auth');


// Use memory storage for Vercel Blob uploads
const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB for Blob
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.txt', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${ext}. Allowed types: ${allowed.join(', ')}`), false);
    }
  }
});

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

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // If using Vercel Blob or external URL, redirect to the file URL
    if (attachment.path.startsWith('http')) {
      return res.redirect(attachment.path);
    }

    // If using local storage, serve the file (fallback)
    const filePath = path.join(__dirname, '..', attachment.path);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Determine MIME type based on file extension
    const extension = attachment.filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'bmp':
        contentType = 'image/bmp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'doc':
        contentType = 'application/msword';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
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

    // If using Vercel Blob or external URL, redirect to the file URL
    if (attachment.path.startsWith('http')) {
      return res.redirect(attachment.path);
    }

    // If using local storage, serve the file (fallback)
    const filePath = path.join(__dirname, '..', attachment.path);
    
    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Determine MIME type based on file extension
    const extension = attachment.filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'bmp':
        contentType = 'image/bmp';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'doc':
        contentType = 'application/msword';
        break;
      case 'docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'xls':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      default:
        contentType = 'application/octet-stream';
    }

    // Set appropriate content type for preview (no download headers)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
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

// Delete comment from task (Admin only)
router.delete('/:taskId/comments/:commentId', verifyToken, deleteTaskComment);

// Upload File to Task - Any logged-in user
router.post('/:id/upload', verifyToken, memoryUpload.single('file'), async (req, res) => {
  const Task = require('../models/Task');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const filename = `task-${req.params.id}-${req.user.id}-${timestamp}-${req.file.originalname}`;

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    const newAttachment = {
      _id: new mongoose.Types.ObjectId(),
      filename: req.file.originalname,
      path: blob.url,
      uploadedAt: new Date()
    };

    task.attachments.push(newAttachment);
    await task.save();
    
    res.status(200).json({ message: 'File uploaded', file: newAttachment });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
