const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const { renameTask, setDueDate, setDescription, deleteTask } = require('../controllers/tasks');
const { createComment } = require('../controllers/comments');
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
  .post('/comments/', bodyValidation(Comment, 'create'), createComment);

module.exports = router;
