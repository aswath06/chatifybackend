'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.LastSeen, {
        foreignKey: 'userId',
        as: 'lastSeen'
      });
      User.hasMany(models.GroupAssign, {
        foreignKey: 'userId',
        as: 'groupAssignments'
      });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      profileImg: { type: DataTypes.STRING, allowNull: true },
      dateOfBirth: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
    }
  );

  return User;
};
