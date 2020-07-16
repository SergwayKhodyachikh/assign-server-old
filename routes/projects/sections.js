const router = require('express').Router({ mergeParams: true });
const Section = require('../../models/section');
const paramValidation = require('../../middleware/paramValidation');

router.post('/', paramValidation('projectId'), async (req, res, next) => {
  try {
    const section = await Section.create({ ...req.body, projectId: req.params.projectId });

    res.send({ status: 'success', section });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
