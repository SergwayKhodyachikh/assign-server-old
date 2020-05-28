const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/sequelize');

class User extends Model {}

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
      validate: { notEmpty: true, len: [1, 255], notNull: true },
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
