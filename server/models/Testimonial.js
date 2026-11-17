'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Testimonial extends Model {}

  Testimonial.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'customer_name',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'title',
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'caption',
    },
    mediaType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'image',
      field: 'media_type',
    },
    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'media_url',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'sort_order',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'active',
    },
  }, {
    sequelize,
    modelName: 'Testimonial',
    tableName: 'testimonials',
    timestamps: true,
    underscored: true,
  });

  return Testimonial;
};
