const router = require('express').Router({ mergeParams: true });
const paramValidation = require('../middleware/paramValidation');
const bodyValidation = require('../middleware/bodyValidation');
const auth = require('../middleware/auth');
const { deleteSection, renameSection } = require('../controllers/sections');
const Section = require('../models/section');

router.use(auth);

router.route('/:sectionId').all(paramValidation('sectionId')).delete(deleteSection);

// change description patch
router.patch(
  '/:sectionId/rename',
  paramValidation('sectionId'),
  bodyValidation(Section, 'rename'),
  renameSection
);

module.exports = router;
