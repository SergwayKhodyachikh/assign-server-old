const { Model, DataTypes } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');

const minDate = Date.now();
const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 100));

const TASK_SCHEMA = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required(),
  }),
  rename: Joi.object({
    title: Joi.string().min(1).max(255).required(),
  }),
  setDueDate: Joi.object().keys({
    dueDate: Joi.date().greater(minDate).less(maxDate),
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
    dueDate: {
      type: DataTypes.DATE,
      validate: {
        min: minDate,
        max: maxDate,
      },
    },
  },
  {
    sequelize,
  }
);

module.exports = Task;
