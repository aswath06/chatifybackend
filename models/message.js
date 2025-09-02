'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.PrivateRoom, {
        foreignKey: 'roomId',
        targetKey: 'roomId',
        as: 'room'
      });
    }
  }

  Message.init({
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    context: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    media_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    read_receipt: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
  });

  return Message;
};
