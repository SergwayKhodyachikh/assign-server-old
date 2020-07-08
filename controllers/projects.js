const Project = require('../models/project');

exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user.id });

    res.send({ status: 'success', project });
  } catch (err) {
    next(err);
  }
};

exports.fetchProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({ ...req.queryParams, where: { owner: req.user.id } });

    res.send({
      status: 'success',
      results: projects.length,
      projects,
    });
  } catch (err) {
    next(err);
  }
};
