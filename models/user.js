const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/sequelize');
const { JWT_KEY } = require('../config/env');

const USER_SCHEMA = {
  create: Joi.object({
    email: Joi.string().min(3).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(1).max(255),
  }),
  login: Joi.object({
    email: Joi.string().min(3).max(255).email().required(),
    password: Joi.string().min(5).max(255).required(),
  }),
};

class User extends Model {
  static validate(reqBody, validationType) {
    return USER_SCHEMA[validationType].validate(reqBody);
  }

  generateAuthToken() {
    return jwt.sign(
      {
        sub: this.id,
        aud: this.role,
        iat: Date.now(),
      },
      JWT_KEY,
      { expiresIn: '20d' }
    );
  }

  authUserChanged(authDate) {
    // creating or saving a document delay the process that why we reduce a sec
    return authDate <= this.getDataValue('updatedAt').getTime() - 1000;
  }

  async comparePassword(password) {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { isEmail: true, notNull: true, notEmpty: true, len: [3, 255] },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [5, 255], notNull: true },
    },
    name: { type: DataTypes.STRING, defaultValue: 'unknown', validate: { len: [1, 255] } },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'guide', 'lead-guide', 'admin']],
      },
    },
    resetToken: {
      type: DataTypes.STRING,
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    hooks: {
      beforeCreate: async user => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
      beforeUpdate: async user => {
        if (user.getDataValue('password') !== user.previous('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

module.exports = User;
