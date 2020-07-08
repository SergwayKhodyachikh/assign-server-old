const Joi = require('@hapi/joi');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const PROJECT_SCHEMA = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    accessibility: Joi.boolean().required(),
  }),
};

class Project extends Model {
  static validate(reqBody, validationType) {
    return PROJECT_SCHEMA[validationType].validate(reqBody);
  }
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255], notNull: true },
    },
    accessibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {
    sequelize,
  }
);

module.exports = Project;
