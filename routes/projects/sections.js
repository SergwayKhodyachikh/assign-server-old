const router = require('express').Router({ mergeParams: true });
const Section = require('../../models/section');
const paramValidation = require('../../middleware/paramValidation');
const { createSection } = require('../../controllers/sections');
const bodyValidation = require('../../middleware/bodyValidation');

router.use(paramValidation('projectId'));

router.post('/', bodyValidation(Section, 'create'), createSection);

module.exports = router;
