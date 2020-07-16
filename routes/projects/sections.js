const router = require('express').Router();
const Section = require('../../models/section');

router.route('/').post(async (req, res, next) => {
  try {
    const section = await Section.create(req.body);

    res.send({ status: 'success', section });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
