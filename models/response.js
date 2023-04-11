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
      response.belongsTo(models.conversation, { foreignKey: 'id' });
    }
  }
  response.init({
    message: DataTypes.TEXT,
    is_conversation: DataTypes.STRING,
    conversation_id: DataTypes.INTEGER,
    comment:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'response',
  });
  return response;
};