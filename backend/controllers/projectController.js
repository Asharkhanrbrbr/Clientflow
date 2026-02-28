import Project from '../models/Project.js';

// Create a new project
export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, deadline, budget, clientId } = req.body;
    const project = await Project.create({
      name,
      description,
      status,
      deadline,
      budget,
      clientId,
      userId: req.user._id,
    });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

// Get projects with filtering by status, pagination
export const getProjects = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);
    res.json({
      projects,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// Get single project
export const getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// Update project
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};
