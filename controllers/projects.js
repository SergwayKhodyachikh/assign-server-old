const Project = require('../models/project');
const ServerError = require('../utils/ServerError');

/**
 * create an new project
 */
exports.createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user.id });

    res.send({ status: 'success', project });
  } catch (err) {
    next(err);
  }
};

/**
 * fetch list of projects
 */
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

/**
 * fetch project by id
 */
exports.fetchProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.projectId, { raw: true });
    // validate if the project exists
    if (!project) throw new ServerError('The project with the given ID was not found.', 404);

    res.status(200).send({
      status: 'Success',
      project,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * update existing project by id
 */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
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
  } catch (err) {
    next(err);
  }
};

/**
 * delete project by id
 */
exports.deleteProject = async (req, res, next) => {
  try {
    // find a single project with the id
    const project = await Project.findByPk(req.params.projectId);
    // validate project existence in the database
    if (!project) throw new ServerError('The project with the given ID was not found.', 404);

    // delete the current project
    await project.destroy();
    // send status if successes
    res.status(204).send({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
