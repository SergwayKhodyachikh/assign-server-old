const { Model, DataTypes } = require('sequelize');
const Joi = require('@hapi/joi');
const sequelize = require('../config/sequelize');
const Task = require('./task');

const SECTION_SCHEMA = {
  create: Joi.object({
    title: Joi.string().min(1).max(255).required(),
  }),
};

class Section extends Model {
  static validate(reqBody, validationType) {
    return SECTION_SCHEMA[validationType].validate(reqBody);
  }
}

Section.init(
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
    order: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  { sequelize }
);

const associationSettings = { foreignKey: 'sectionId', onUpdate: 'RESTRICT', onDelete: 'CASCADE' };

Section.hasMany(Task, associationSettings);
Task.belongsTo(Section, associationSettings);

module.exports = Section;
