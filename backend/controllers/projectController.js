const Project = require('../models/Project');

// CREATE project
const createProject = async (req, res) => {
  const { name, description, deadline, teamMembers, status, projectManager } = req.body;
  try {
    const project = new Project({
      name,
      description,
      deadline,
      teamMembers,
      status,
      projectManager
    });

    await project.save();

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('teamMembers', 'name email role')
      .populate('projectManager', 'name email role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};

// UPDATE project
const updateProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true })
      .populate('teamMembers', 'name email role')
      .populate('projectManager', 'name email role');

    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete all tasks associated with this project
    const Task = require('../models/Task');
    const deletedTasks = await Task.deleteMany({ project: id });
    


    // Delete the project
    await Project.findByIdAndDelete(id);
    res.json({ 
      message: 'Project and associated tasks deleted successfully',
      deletedTasksCount: deletedTasks.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

// ADD COMMENT to a project
const addCommentToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const comment = {
      text: req.body.text,
      author: req.user.id,
      createdAt: new Date()
    };

    project.comments.push(comment);
    await project.save();

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// GET comments for a project
const getProjectComments = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('comments.author', 'name email');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project.comments || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
};

// DELETE comment from a project (Admin only)
const deleteProjectComment = async (req, res) => {
  try {
    const { projectId, commentId } = req.params;
    
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can delete comments' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Find and remove the comment
    const commentIndex = project.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    project.comments.splice(commentIndex, 1);
    await project.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// GET team members of a specific project
const getProjectTeamMembers = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('teamMembers', 'name email role');
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.json(project.teamMembers || []);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching team members' });
  }
};

// Get Projects (Team Members see only assigned ones)
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === 'Team Member') {
      projects = await Project.find({ assignedTo: req.user.id });
    } else {
      projects = await Project.find();
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};


module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  addCommentToProject,
  getProjectComments,
  deleteProjectComment,
  getProjectTeamMembers,
  getProjects 
};
