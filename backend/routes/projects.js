const express = require('express');
const router = express.Router();
const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const { verifyToken, checkRole } = require('../middleware/auth');

// CREATE new project — Admin or Manager
router.post('/', verifyToken, checkRole('Admin', 'Manager'), createProject);

// GET all projects — Admin or Manager
router.get('/', verifyToken, checkRole('Admin', 'Manager'), getAllProjects);

// UPDATE project — Admin or Manager
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), updateProject);

// DELETE project — Admin only
router.delete('/:id', verifyToken, checkRole('Admin'), deleteProject);

module.exports = router;
