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
const sections = require('./sections');

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

module.exports = router;
