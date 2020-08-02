const Comment = require('../models/comment');

module.exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      taskId: req.params.taskId,
      author: req.user.id,
    });

    res.send({ status: 'success', comment });
  } catch (err) {
    next(err);
  }
};
