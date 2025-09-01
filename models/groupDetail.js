'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupDetail extends Model {
    static associate(models) {
      GroupDetail.hasMany(models.GroupAssign, {
        foreignKey: 'groupId',
        as: 'assignments',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  GroupDetail.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      groupName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'GroupDetail',
      tableName: 'GroupDetails',
      timestamps: false,
    }
  );

  return GroupDetail;
};
