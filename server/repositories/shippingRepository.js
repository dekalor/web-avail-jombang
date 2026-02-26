// const { Province, City, District, Courier, ShippingCost } = require('../models');
const { Province, City, District, Courier, ShippingCost } = require('../models')
const { RAJAONGKIR } = require('../config/config')
const { Op } = require("sequelize");

const shippingRepository = {

  // Province
  provinceFindAll() {
    return Province.findAll({
      order: [['name', 'ASC']],
    });
  },

  // City
  cityFindAll({ province_id, attributes = null } = {}) {
    const where = { province_id };

    return City.findAll({
      attributes,
      where,
      order: [['name', 'ASC']],
    });
  },

  cityFindById(id) {
    return City.findByPk(id);
  },

  // District
  districtFindAll({ city_id, attributes = null } = {}) {
    const where = { city_id };

    return District.findAll({
      attributes,
      where,
      order: [['name', 'ASC']],
    });
  },

  // Courier
  courierFindAll() {
    return Courier.findAll({
      where: {
        active: true,
      },
      order: [['code', 'ASC']],
    });
  },

  // Shipping Costs
  getShippingCosts(destination_district_id, couriers, including_expired = false) {
    const where = {
      origin_district_id: RAJAONGKIR.ORIGIN_DISTRICT_ID,
      destination_district_id,
      courier: {
        [Op.in]: couriers
      },
    }
    if (!including_expired) {
      where.expires_at = {
        [Op.gt]: new Date()
      }
    }

    return ShippingCost.findAll({
      where
    });
  },

  async saveShippingCosts(destination_district_id, api_data) {
    for (const item of api_data) {
      await ShippingCost.upsert({
        originDistrictId: RAJAONGKIR.ORIGIN_DISTRICT_ID,
        destinationDistrictId: destination_district_id,
        courier: item.code,
        service: item.service,
        pricePerKg: item.cost,
        etd: item.etd,
        expiresAt: new Date(
          Date.now() + RAJAONGKIR.CACHE_DAYS * 86400000
        )
      });
    }
  },

};

module.exports = shippingRepository;
