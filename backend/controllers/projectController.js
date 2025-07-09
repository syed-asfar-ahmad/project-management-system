const Project = require('../models/Project');

// CREATE project
const createProject = async (req, res) => {
  const { name, description, deadline, teamMembers, status } = req.body;
  console.log("REQ.BODY STATUS:", req.body.status);
  console.log("FULL REQ.BODY:", req.body);
  try {
    const project = new Project({
      name,
      description,
      deadline,
      teamMembers,
      status
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
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Project updated', project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error updating project' });
  }
};

// DELETE project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await Project.findByIdAndDelete(id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting project' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject
};
