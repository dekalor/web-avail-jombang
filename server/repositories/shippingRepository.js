const { Province, City, Courier } = require('../db/index');

const shippingRepository = {

  // Province
  provinceFindAll() {
    return Province.findAll({
      order: [['id', 'ASC']],
    });
  },

  // City
  cityFindAll({ province_id, attributes = null } = {}) {
    const where = { province_id };

    return City.findAll({
      attributes,
      where,
      order: [['id', 'ASC']],
    });
  },

  cityFindById(id) {
    return City.findByPk(id);
  },

  // Courier
  courierFindAll() {
    return Courier.findAll({
      order: [['id', 'ASC']],
    });
  },

};

module.exports = shippingRepository;
