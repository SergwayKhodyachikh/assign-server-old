const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const ServerError = require('../utils/ServerError');
const { renameTask, setDueDate, setDescription } = require('../controllers/tasks');
const paramValidation = require('../middleware/paramValidation');
const bodyValidation = require('../middleware/bodyValidation');
const auth = require('../middleware/auth');

router.use(auth);

router
  .all(paramValidation('taskId'))
  .patch('/set-due-date', bodyValidation(Task, 'setDueDate'), setDueDate)
  .patch('/set-description', bodyValidation(Task, 'setDescription'), setDescription)
  .patch('/rename', bodyValidation(Task, 'rename'), renameTask);

module.exports = router;
