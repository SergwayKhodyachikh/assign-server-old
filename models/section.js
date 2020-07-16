const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Joi = require('@hapi/joi');

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

Section.init({
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
});

module.exports = Section;
