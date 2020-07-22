const Joi = require('@hapi/joi');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Section = require('./section');

const PROJECT_SCHEMA = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required(),
    accessibility: Joi.boolean().required(),
  }),
  edit: Joi.object({
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
    },
  },
  {
    sequelize,
  }
);

const associationSettings = { foreignKey: 'projectId', onUpdate: 'RESTRICT', onDelete: 'CASCADE' };

Project.hasMany(Section, associationSettings);
Section.belongsTo(Project, associationSettings);

module.exports = Project;
