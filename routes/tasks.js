const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const ServerError = require('../utils/ServerError');
const { renameTask, setDueDate, setDescription, deleteTask } = require('../controllers/tasks');
const paramValidation = require('../middleware/paramValidation');
const bodyValidation = require('../middleware/bodyValidation');
const auth = require('../middleware/auth');
const Comment = require('../models/comment');

router.use(auth);

router
  // validate taskId param
  .all(paramValidation('taskId'))
  // change date patch route
  .patch('/set-due-date', bodyValidation(Task, 'setDueDate'), setDueDate)
  // change description patch
  .patch('/set-description', bodyValidation(Task, 'setDescription'), setDescription)
  // change description patch
  .patch('/rename', bodyValidation(Task, 'rename'), renameTask)
  // delete task route
  .delete('/', deleteTask)
  .post('/comments/', async (req, res, next) => {
    try {
      const comment = await Comment.create({
        ...req.body,
        taskId: req.params.taskId,
        author: req.user.id,
      });

      res.send({ status: 'success', section: comment });
    } catch (err) {
      next(err);
    }
  });
module.exports = router;
