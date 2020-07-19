const router = require('express').Router();
const Project = require('../../models/project');
const auth = require('../../middleware/auth');
const bodyValidation = require('../../middleware/bodyValidation');
const queryHandler = require('../../middleware/queryHandler');
const paramValidation = require('../../middleware/paramValidation');
const {
  createProject,
  fetchProjects,
  fetchProject,
  updateProject,
  deleteProject,
} = require('../../controllers/projects');
const sections = require('./sections/sections');
const Task = require('../../models/task');
const { createTask } = require('../../controllers/tasks');

router.use(auth);

router.post('/', bodyValidation(Project, 'create'), createProject);

router.get('/', queryHandler(Project), fetchProjects);

router
  .route('/:projectId')
  .all(paramValidation('projectId'))
  .delete(deleteProject)
  .get(fetchProject)
  .put(bodyValidation(Project, 'edit'), updateProject);

router.use('/:projectId/sections', sections);

router.post(
  '/sections/:sectionId/tasks',
  paramValidation('sectionId'),
  bodyValidation(Task, 'create'),
  createTask
);

module.exports = router;
