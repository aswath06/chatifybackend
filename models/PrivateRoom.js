'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrivateRoom extends Model {
    static associate(models) {
      PrivateRoom.hasMany(models.Message, {
        foreignKey: 'roomId',
        sourceKey: 'roomId',
        as: 'messages'
      });
    }
  }

  PrivateRoom.init({
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PrivateRoom',
  });

  return PrivateRoom;
};
