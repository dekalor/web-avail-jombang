const axios = require("axios")
const { RAJAONGKIR } = require("../config/config")

const axiosInstance = axios.create({
  baseURL: RAJAONGKIR.BASE_URL,
  headers: {
    key: RAJAONGKIR.API_KEY
  }
})

exports.fetchProvinces = async function () {

  const res = await axiosInstance.get("/api/v1/destination/province")

  return res.data.data

}

exports.fetchCities = async function (provinceId) {

  const res = await axiosInstance.get(
    `/api/v1/destination/city/${provinceId}`
  )

  return res.data.data

}

exports.fetchDistricts = async function (cityId) {

  const res = await axiosInstance.get(
    `/api/v1/destination/district/${cityId}`
  )

  return res.data.data

}

exports.fetchShippingCost = async function (destination_district_id, couriers = []) {
  console.log("Fetching Shipping Costs to RajaOngkir")
  const params = new URLSearchParams();
  const couriersParams = couriers.join(':');

  params.append("origin", RAJAONGKIR.ORIGIN_DISTRICT_ID);
  params.append("destination", destination_district_id);
  params.append("weight", RAJAONGKIR.DEFAULT_WEIGHT);
  params.append("courier", couriersParams); // jne:jnt:pos
  params.append("price", "lowest");

  const res = await axiosInstance.post(`${RAJAONGKIR.BASE_URL}/api/v1/calculate/district/domestic-cost`, params)

  return getLowestCostPerCode(res.data.data);
}

const getLowestCostPerCode = (shippingData) => {
  const result = {}

  for (const item of shippingData) {
    if (!result[item.code] || item.cost < result[item.code].cost) {
      result[item.code] = item
    }
  }

  return Object.values(result)
}