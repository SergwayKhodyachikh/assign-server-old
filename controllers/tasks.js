const Task = require('../models/task');
const ServerError = require('../utils/ServerError');

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

exports.renameTask = async (req, res, next) => {
  try {
    // find the task and check if exists
    const task = await Task.findByPk(req.params.taskId);
    if (!task) throw new ServerError('The task with the given ID was not found.', 404);
    // update the value and save in the database
    task.title = req.body.title;
    await task.save();
    // get the latest data from the database and send the client
    await task.reload();
    res.send({
      status: 'success',
      task,
    });
  } catch (err) {
    next(err);
  }
}