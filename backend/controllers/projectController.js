const Project = require('../models/Project');
const { createNotificationsForUsers, createNotification } = require('./notificationController');
const User = require('../models/User');

// CREATE project
const createProject = async (req, res) => {
  const { name, description, deadline, teamMembers, status } = req.body;
  try {
    const project = new Project({
      name,
      description,
      deadline,
      teamMembers,
      status
    });

    await project.save();

    // Create notifications for team members
    if (teamMembers && teamMembers.length > 0) {
      const notificationTitle = 'New Project Created';
      const notificationMessage = `You have been added to the project "${name}"`;
      
      await createNotificationsForUsers(
        teamMembers,
        req.user.id,
        'project_created',
        notificationTitle,
        notificationMessage,
        project._id
      );
    }

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Error creating project' });
  }
};

// GET all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('teamMembers', 'name email role');
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

    // Store original values for comparison
    const originalName = project.name;
    const originalStatus = project.status;
    const originalTeamMembers = project.teamMembers || [];

    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });

    // Create notifications for project updates
    const projectName = updated.name;

    // Notification for name change
    if (req.body.name && req.body.name !== originalName) {
      const notificationTitle = 'Project Name Updated';
      const notificationMessage = `Project "${originalName}" has been renamed to "${projectName}"`;
      
      if (updated.teamMembers && updated.teamMembers.length > 0) {
        await createNotificationsForUsers(
          updated.teamMembers,
          req.user.id,
          'project_updated',
          notificationTitle,
          notificationMessage,
          updated._id
        );
      }
    }

    // Notification for status change
    if (req.body.status && req.body.status !== originalStatus) {
      const notificationTitle = 'Project Status Updated';
      const notificationMessage = `Project "${projectName}" status changed to ${req.body.status}`;
      
      if (updated.teamMembers && updated.teamMembers.length > 0) {
        await createNotificationsForUsers(
          updated.teamMembers,
          req.user.id,
          'project_updated',
          notificationTitle,
          notificationMessage,
          updated._id
        );
      }
    }

    // Notification for team member changes
    if (req.body.teamMembers && req.body.teamMembers.length !== originalTeamMembers.length) {
      const notificationTitle = 'Project Team Updated';
      const notificationMessage = `Team members have been updated for project "${projectName}"`;
      
      if (updated.teamMembers && updated.teamMembers.length > 0) {
        await createNotificationsForUsers(
          updated.teamMembers,
          req.user.id,
          'project_updated',
          notificationTitle,
          notificationMessage,
          updated._id
        );
      }
    }

    // Notification for other updates (description, deadline)
    if (req.body.description || req.body.deadline) {
      const notificationTitle = 'Project Updated';
      const notificationMessage = `Project "${projectName}" has been updated`;
      
      if (updated.teamMembers && updated.teamMembers.length > 0) {
        await createNotificationsForUsers(
          updated.teamMembers,
          req.user.id,
          'project_updated',
          notificationTitle,
          notificationMessage,
          updated._id
        );
      }
    }

    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    console.error('Error updating project:', err);
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

    // Create notifications for project deletion
    if (project.teamMembers && project.teamMembers.length > 0) {
      const notificationTitle = 'Project Deleted';
      const notificationMessage = `Project "${project.name}" has been deleted`;
      
      await createNotificationsForUsers(
        project.teamMembers,
        req.user.id,
        'project_updated',
        notificationTitle,
        notificationMessage,
        project._id
      );
    }

    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Error deleting project:', err);
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

    // Create notifications for project comment
    if (project.teamMembers && project.teamMembers.length > 0) {
      const notificationTitle = 'New Project Comment';
      const notificationMessage = `A new comment has been added to project "${project.name}"`;
      
      // Notify all team members except the comment author
      const recipients = project.teamMembers.filter(member => member.toString() !== req.user.id);
      
      if (recipients.length > 0) {
        await createNotificationsForUsers(
          recipients,
          req.user.id,
          'project_updated',
          notificationTitle,
          notificationMessage,
          project._id
        );
      }
    }

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    console.error('Error adding comment:', err);
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
  getProjectTeamMembers,
  getProjects 
};
