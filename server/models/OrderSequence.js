const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderSequence extends Model {

    static associate(models) {

    }

  }

  OrderSequence.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    last_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'OrderSequence',
    tableName: 'order_sequences',
    timestamps: false,
  });

  return OrderSequence;
};