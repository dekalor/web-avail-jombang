const shippingRepository = require('../repositories/shippingRepository');

const shippingService = {

  async getAllProvinces() {
    return shippingRepository.provinceFindAll();
  },

  async getAllCitiesByProvince(province_id) {
    return shippingRepository.cityFindAll({province_id, attributes: ['id', 'name']})
  },

  async getAllCouriers() {
    return shippingRepository.courierFindAll();
  },

};

module.exports = shippingService;
