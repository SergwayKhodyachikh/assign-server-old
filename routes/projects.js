const router = require('express').Router();
const Project = require('../models/project');
const auth = require('../middleware/auth');
const bodyValidation = require('../middleware/bodyValidation');
const queryHandler = require('../middleware/queryHandler');
const { createProject, fetchProjects } = require('../controllers/projects');

router.use(auth);

router.post('/', bodyValidation(Project, 'create'), createProject);

router.get('/', queryHandler(Project), fetchProjects);

module.exports = router;
