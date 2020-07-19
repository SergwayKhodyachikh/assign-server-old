const Task = require('../models/task');

/**
 * Create a new Task
 */
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, sectionId: req.params.sectionId });

    res.send({ status: 'success', task });
  } catch (err) {
    next(err);
  }
};
