const Section = require('../models/section');

/**
 * Create a new section
 */
exports.createSection = async (req, res, next) => {
  try {
    const section = await Section.create({ ...req.body, projectId: req.params.projectId });

    res.send({ status: 'success', section });
  } catch (err) {
    next(err);
  }
};
