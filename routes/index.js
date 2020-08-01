const router = require('express').Router();
const users = require('./users');
const tasks = require('./tasks');
const sections = require('./sections');
const projects = require('./projects/projects');

router.use('/users', users);
router.use('/tasks/:taskId', tasks);
router.use('/sections', sections);
router.use('/projects', projects);

module.exports = router;
