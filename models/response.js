'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class response extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      response.belongsTo(models.conversation, { foreignKey: 'conversation_id' });
    }
  }
  response.init({
    message: DataTypes.TEXT,
    is_conversation: DataTypes.STRING,
    is_favourite: DataTypes.BOOLEAN,
    conversationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'response',
  });
  return response;
};