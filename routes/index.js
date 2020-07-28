const router = require('express').Router();
const users = require('./users');
const tasks = require('./tasks');
const projects = require('./projects/projects');

router.use('/users', users);
router.use('/tasks', tasks);
router.use('/projects', projects);

module.exports = router;
