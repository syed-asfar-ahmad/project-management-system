const express = require('express');
const router = express.Router();
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
    console.error('Failed to fetch projects:', err);
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
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

module.exports = router;
