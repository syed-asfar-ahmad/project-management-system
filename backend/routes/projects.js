const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { put } = require("@vercel/blob");
const mongoose = require('mongoose');

const {
  createProject,
  updateProject,
  deleteProject,
  addCommentToProject,
  getProjectComments,
  getProjectTeamMembers
} = require('../controllers/projectController');

const { verifyToken, checkRole, checkManagerProjectAccess } = require('../middleware/auth');


const Project = require('../models/Project');

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

// GET all projects — Role-based logic inside
router.get('/', verifyToken, async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Team Member') {
      projects = await Project.find({ teamMembers: req.user.id })
        .populate('teamMembers', 'name email')
        .populate('projectManager', 'name email');
    } else if (req.user.role === 'Manager') {
      projects = await Project.find({
        $or: [
          { teamMembers: req.user.id },
          { projectManager: req.user.id }
        ]
      })
        .populate('teamMembers', 'name email')
        .populate('projectManager', 'name email');
    } else {
      projects = await Project.find()
        .populate('teamMembers', 'name email')
        .populate('projectManager', 'name email');
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// CREATE new project — Admin only
router.post('/', verifyToken, checkRole('Admin'), createProject);

// UPDATE project — Admin or Manager (if assigned to project)
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), checkManagerProjectAccess, updateProject);

// Add Comment to a Project
router.post('/:id/comments', verifyToken, addCommentToProject);

// DELETE project — Admin or Manager (if assigned to project)
router.delete('/:id', verifyToken, checkRole('Admin', 'Manager'), checkManagerProjectAccess, deleteProject);

router.get('/:id/comments', verifyToken, getProjectComments);

router.get('/my-projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let projects;
    
    if (req.user.role === 'Manager') {
      projects = await Project.find({
        $or: [
          { teamMembers: userId },
          { projectManager: userId }
        ]
      })
        .populate('teamMembers', 'name email')
        .populate('projectManager', 'name email');
    } else {
      projects = await Project.find({ teamMembers: userId })
        .populate('teamMembers', 'name email')
        .populate('projectManager', 'name email');
    }
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
});

router.get('/:projectId/team-members', getProjectTeamMembers);

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email')
      .populate('projectManager', 'name email');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Download Project Attachment - Any logged-in user
router.get('/:id/attachments/:attachmentId/download', verifyToken, async (req, res) => {
  const Project = require('../models/Project');
  const { id, attachmentId } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const attachment = project.attachments.id(attachmentId);
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

// Preview Project Attachment - Any logged-in user (without download headers)
router.get('/:id/attachments/:attachmentId/preview', verifyToken, async (req, res) => {
  const Project = require('../models/Project');
  const { id, attachmentId } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const attachment = project.attachments.id(attachmentId);
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

// Delete Project Attachment - Admin only
router.delete('/:id/attachments/:attachmentId', verifyToken, checkRole('Admin'), async (req, res) => {
  const { id, attachmentId } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const attachment = project.attachments.id(attachmentId);
    if (!attachment) return res.status(404).json({ error: 'Attachment not found' });

    // Remove the attachment from the array
    project.attachments.pull(attachmentId);
    await project.save();

    res.json({ message: 'Attachment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Upload File to Project - Any logged-in user
router.post('/:id/upload', verifyToken, memoryUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const filename = `project-${req.params.id}-${req.user.id}-${timestamp}-${req.file.originalname}`;

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

    project.attachments.push(newAttachment);
    await project.save();
    
    res.status(200).json({ message: 'File uploaded', file: newAttachment });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
