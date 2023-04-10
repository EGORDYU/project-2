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
      conversation.hasMany(models.response, { foreignKey: 'id' });
    }
  }
  conversation.init({
    userId: DataTypes.INTEGER,
    prompt: DataTypes.TEXT,
    is_favorite: DataTypes.BOOLEAN,
    generated_text: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'conversation',
  });
  return conversation;
};