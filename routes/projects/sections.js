const router = require('express').Router({ mergeParams: true });
const Section = require('../../models/section');
const paramValidation = require('../../middleware/paramValidation');
const { createSection, fetchSections } = require('../../controllers/sections');
const bodyValidation = require('../../middleware/bodyValidation');
const queryHandler = require('../../middleware/queryHandler');

router.use(paramValidation('projectId'));

router.post('/', bodyValidation(Section, 'create'), createSection);
router.get('/', queryHandler(Section), fetchSections);

module.exports = router;
