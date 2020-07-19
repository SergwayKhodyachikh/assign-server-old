const { Model, DataTypes } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');

const TASK_SCHEMA = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required(),
  }),
};

class Task extends Model {
  static validate(reqBody, validationType) {
    return TASK_SCHEMA[validationType].validate(reqBody);
  }
}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notNull: true, notEmpty: true, len: [1, 255] },
    },
  },
  {
    sequelize,
  }
);

module.exports = Task;

