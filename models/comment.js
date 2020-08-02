const Joi = require('@hapi/joi');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user');
const Task = require('./task');

const COMMENT_SCHEMA = {
  create: Joi.object({
    message: Joi.string().min(1).max(2000).required(),
  }),
};

class Comment extends Model {
  static validate(reqBody, validationType) {
    return COMMENT_SCHEMA[validationType].validate(reqBody);
  }
}

Comment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 2000], notNull: true },
    },
  },
  {
    sequelize,
  }
);

const associationSettings = { foreignKey: 'taskId', onUpdate: 'RESTRICT', onDelete: 'CASCADE' };
Task.hasMany(Comment, associationSettings);
Comment.belongsTo(Task, associationSettings);

const authorAssociationSettings = {
  foreignKey: 'author',
  onUpdate: 'RESTRICT',
  onDelete: 'CASCADE',
};
User.hasMany(Comment, authorAssociationSettings);
Comment.belongsTo(User, authorAssociationSettings);

// Comment.hasMany(Section, associationSettings);
// Section.belongsTo(Comment, associationSettings);

module.exports = Comment;
