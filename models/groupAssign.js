'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupAssign extends Model {
    static associate(models) {
      GroupAssign.belongsTo(models.GroupDetail, {
        foreignKey: 'groupId',
        as: 'group',
      });
      GroupAssign.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  GroupAssign.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'GroupAssign',
      tableName: 'GroupAssigns',
      timestamps: false,
    }
  );

  return GroupAssign;
};
