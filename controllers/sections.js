const Section = require('../models/section');
const Task = require('../models/task');

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

exports.fetchSections = async (req, res, next) => {
  try {
    const sections = await Section.findAll({
      ...req.queryParams,
      where: {
        projectId: req.params.projectId,
      },
      include: { model: Task },
    });

    res.send({
      status: 'success',
      results: sections.length,
      sections,
    });
  } catch (err) {
    next(err);
  }
};
