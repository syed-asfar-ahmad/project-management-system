const express = require('express');
const router = express.Router();
const {
  createProject,
  updateProject,
  deleteProject,
  addCommentToProject,
  getProjectComments // add this here
} = require('../controllers/projectController');


const { verifyToken, checkRole } = require('../middleware/auth');

const Project = require('../models/Project'); // Add this if not already
// This was likely missing, also causing 500 errors

// GET all projects — Role-based logic inside
router.get('/', verifyToken, async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Team Member') {
      projects = await Project.find({ teamMembers: req.user.id }).populate('teamMembers', 'name email');
    } else {
      projects = await Project.find().populate('teamMembers', 'name email');
    }

    res.json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// CREATE new project — Admin or Manager
router.post('/', verifyToken, checkRole('Admin', 'Manager'), createProject);

// UPDATE project — Admin or Manager
router.put('/:id', verifyToken, checkRole('Admin', 'Manager'), updateProject);

// Add Comment to a Project
router.post('/:id/comments', verifyToken, addCommentToProject);

// DELETE project — Admin only
router.delete('/:id', verifyToken, checkRole('Admin'), deleteProject);

router.get('/:id/comments', verifyToken, getProjectComments);

// OPTIONAL: Separate route for team member to fetch only their projects
router.get('/my-projects', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ teamMembers: userId }).populate('teamMembers', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user projects' });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamMembers', 'name email');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router;
