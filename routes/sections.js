const router = require('express').Router({ mergeParams: true });
const Task = require('../models/task');
const ServerError = require('../utils/ServerError');
const { renameTask, setDueDate, setDescription } = require('../controllers/tasks');
const paramValidation = require('../middleware/paramValidation');
const bodyValidation = require('../middleware/bodyValidation');
const auth = require('../middleware/auth');
const { deleteSection } = require('../controllers/sections');

router.use(auth);

router.route('/:sectionId').all(paramValidation('sectionId')).delete(deleteSection);

module.exports = router;
