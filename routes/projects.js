const router = require('express').Router();
const Project = require('../models/project');
const auth = require('../middleware/auth');
const bodyValidation = require('../middleware/bodyValidation');
const queryHandler = require('../middleware/queryHandler');
const paramValidation = require('../middleware/paramValidation');
const {
  createProject,
  fetchProjects,
  fetchProject,
  updateProject,
} = require('../controllers/projects');

router.use(auth);

router.post('/', bodyValidation(Project, 'create'), createProject);

router.get('/', queryHandler(Project), fetchProjects);

router
  .route('/:id')
  .get(paramValidation, fetchProject)
  .put(paramValidation, bodyValidation(Project, 'edit'), updateProject);

module.exports = router;
