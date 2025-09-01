'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LastSeen extends Model {
    static associate(models) {
      // Relation: A LastSeen belongs to a User
      LastSeen.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  LastSeen.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'LastSeen',
  });
  return LastSeen;
};
