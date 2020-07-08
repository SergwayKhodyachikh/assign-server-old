const router = require('express').Router();
const users = require('./users');
const projects = require('./projects');

router.use('/users', users);

router.use('/projects', projects)

module.exports = router;
