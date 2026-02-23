const shippingService = require('../services/shippingService');

const shippingController = {

  async getAllProvinces(req, res, next) {
    try {
      const provinces = await shippingService.getAllProvinces();
      res.json({ success: true, data: provinces });
    } catch (err) { next(err); }
  },

  async getAllCities(req, res, next) {
    try {
      const { province_id } = req.query;

      const cities = await shippingService.getAllCitiesByProvince(province_id)
      res.json({ success: true, data: cities });
    } catch (err) { next(err); }
  },

  async getAllCouriers(req, res, next) {
    try {
      const couriers = await shippingService.getAllCouriers();
      res.json({ success: true, data: couriers });
    } catch (err) { next(err); }
  },

};

module.exports = shippingController;
