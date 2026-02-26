const shippingRepository = require('../repositories/shippingRepository');
const { fetchShippingCost } = require('../utils/rajaOngkirService')
const retry = require('../utils/retry')

const shippingService = {

  async getAllProvinces() {
    return shippingRepository.provinceFindAll();
  },

  async getAllCitiesByProvince(province_id) {
    return shippingRepository.cityFindAll({ province_id, attributes: ['id', 'name'] })
  },

  async getAllDistrictsByCities(city_id) {
    return shippingRepository.districtFindAll({ city_id, attributes: ['id', 'name'] })
  },

  async getAllCouriers() {
    return shippingRepository.courierFindAll();
  },

  calculateCost(price_per_kg, weight) {
    const kg = Math.ceil(weight / 1000);
    return kg * price_per_kg;
  },

  async getShippingCosts(destination_district_id, weight) {
    const couriers = (await this.getAllCouriers())
      .map(v => v.code)

    // Step 1: get valid cache
    let cachedShippingCost = await shippingRepository.getShippingCosts(destination_district_id, couriers);
    if (!cachedShippingCost.length) {
      try {
        // Step 2: fetch API with retry
        const apiData = await retry(
          () => fetchShippingCost(destination_district_id, couriers),
          3,
          attempt => attempt * 1000 // delay with exponential backoff
        );

        await shippingRepository.saveShippingCosts(destination_district_id, apiData);

        cachedShippingCost = await shippingRepository.getShippingCosts(destination_district_id, couriers);

      } catch (error) {
        console.error(
          "Shipping API failed after 3 retries:",
          error.message
        );

        // Step 3: fallback to stale cache
        const staleCache = await shippingRepository.getShippingCosts(destination_district_id, couriers, true);
        if (staleCache.length) {
          console.warn("Using stale shipping cost cache");

          return staleCache.map(item => ({
            code: item.courier,
            etd: item.etd,
            price: this.calculateCost(item.pricePerKg, weight),
            is_stale: true
          }));
        }

        // Step 4: no cache at all → throw controlled error
        throw new Error("Unable to fetch shipping cost. Please try again later.");
      }
    }

    return cachedShippingCost.map(item => ({
      code: item.courier,
      etd: item.etd,
      price: this.calculateCost(item.pricePerKg, weight),
      is_stale: false
    }));
  },

};

module.exports = shippingService;
