const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CheckoutChallenge extends Model { }

  CheckoutChallenge.init({
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    guestToken: {
      type: DataTypes.STRING(48),
      allowNull: false,
      field: 'guest_token',
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    issuedAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'issued_at',
    },
    expiresAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'expires_at',
    },
  }, {
    sequelize,
    modelName: 'CheckoutChallenge',
    tableName: 'checkout_challenges',
    timestamps: false,
  });

  return CheckoutChallenge;
};
