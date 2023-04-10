'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      conversation.belongsTo(models.user, { foreignKey: 'userId' });
      conversation.hasMany(models.response, { foreignKey: 'response_id' });
    }
  }
  conversation.init({
    userId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    is_favourite: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'conversation',
  });
  return conversation;
};