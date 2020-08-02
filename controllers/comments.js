const Comment = require('../models/comment');
const User = require('../models/user');

module.exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      taskId: req.params.taskId,
      authorId: req.user.id,
    });

    res.send({ status: 'success', comment });
  } catch (err) {
    next(err);
  }
};
