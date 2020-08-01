const Section = require('../models/section');
const Task = require('../models/task');
const ServerError = require('../utils/ServerError');

/**
 * Create a new section
 */
exports.createSection = async (req, res, next) => {
  try {
    const section = await Section.create(
      { ...req.body, projectId: req.params.projectId, Tasks: [] },
      { include: { model: Task } }
    );

    res.send({ status: 'success', section });
  } catch (err) {
    next(err);
  }
};

/**
 * delete section by id
 */
exports.deleteSection = async (req, res, next) => {
  try {
    // find a single project with the id
    const section = await Section.findByPk(req.params.sectionId);
    // validate project existence in the database
    if (!section) throw new ServerError('The project with the given ID was not found.', 404);

    // delete the current project
    await section.destroy();
    // send status if successes
    res.status(204).send({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
