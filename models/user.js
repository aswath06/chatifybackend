'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User has one LastSeen record
      User.hasOne(models.LastSeen, { foreignKey: 'userId', as: 'lastSeen' });
    }
  }

  User.init({
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // ✅ email validation
      }
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // explicit table name
    timestamps: true    // createdAt & updatedAt
  });

  return User;
};
