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
      response.belongsTo(models.user, { foreignKey: 'user_id'});
    }
  }
  response.init({
    is_conversation: DataTypes.STRING,
    conversation_id: DataTypes.INTEGER,
    comment:DataTypes.TEXT,
    user_id:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'response',
  });
  return response;
};