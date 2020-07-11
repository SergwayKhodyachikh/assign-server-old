const Project = require('../models/project');
const ServerError = require('../utils/ServerError');

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

exports.fetchProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id, { raw: true });
  // validate if the project exists
  if (!project) throw new ServerError('The project with the given ID was not found.', 404);

  res.status(200).send({
    status: 'Success',
    project,
  });
};

/**
 * update existing project request by id
 */
exports.updateProject = async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  // check if the request exists
  if (!project) {
    throw new ServerError('The project with the given ID was not found.', 404);
  }
  // remove the old image
  await project.update(req.body);

  res.send({
    status: 'Success',
    project,
  });
};
