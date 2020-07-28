const router = require('express').Router();
const Task = require('../models/task');
const ServerError = require('../utils/ServerError');
const { renameTask } = require('../controllers/tasks');
const paramValidation = require('../middleware/paramValidation');
const bodyValidation = require('../middleware/bodyValidation');
const auth = require('../middleware/auth');

router.use(auth);

router
  .route('/:taskId')
  .all(paramValidation('taskId'))
  .patch(bodyValidation(Task, 'rename'), renameTask);

module.exports = router;
