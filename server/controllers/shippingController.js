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

  async getAllDistricts(req, res, next) {
    try {
      const { city_id } = req.query;

      const cities = await shippingService.getAllDistrictsByCities(city_id)
      res.json({ success: true, data: cities });
    } catch (err) { next(err); }
  },

  async getAllCouriers(req, res, next) {
    try {
      const couriers = await shippingService.getAllCouriers();
      res.json({ success: true, data: couriers });
    } catch (err) { next(err); }
  },

  async getShippingCosts(req, res, next) {
    try {
      const { destination_district_id, weight } = req.query;

      const shippingCosts = await shippingService.getShippingCosts(destination_district_id, weight);

      res.json({
        success: true,
        data: shippingCosts
      });

    } catch (error) {
      console.error(error)
      res.status(503).json({
        success: false,
        message: error.message
      });
    }
  },

};

module.exports = shippingController;
