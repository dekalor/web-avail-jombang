const dotenv = require("dotenv")
dotenv.config()

const { sequelize, Province, City, District } = require('../models');
const { Op } = require("sequelize");

const {
  fetchProvinces,
  fetchCities,
  fetchDistricts,
} = require("../utils/rajaOngkirService.js")

async function seedProvinces() {

  const provinces = await fetchProvinces()

  const data = provinces.map(p => ({
    id: p.province_id,
    name: p.province
  }))

  await Province.bulkCreate(data, {
    ignoreDuplicates: true
  })

  console.log("Provinces seeded")

}

async function seedCities() {

  const provinces = await Province.findAll()

  for (const province of provinces) {

    const cities = await fetchCities(province.id)

    const data = cities.map(c => ({
      id: c.id,
      provinceId: province.id,
      name: c.name
    }))

    await City.bulkCreate(data, {
      ignoreDuplicates: true
    })

    console.log(
      `Cities seeded for province ${province.id}`
    )

  }

}

async function seedDistricts() {

  const startCityId = 564 // Because of rajaongkir request limit/day so we need pointer to continue the process later
  const cities = await City.findAll({
    where: {
      id: {
        [Op.gte]: startCityId
      }
    }
  })

  for (const city of cities) {

    const districts = await fetchDistricts(city.id)

    const data = districts.map(c => ({
      id: c.id,
      cityId: city.id,
      name: c.name
    }))

    await District.bulkCreate(data, {
      ignoreDuplicates: true
    })

    console.log(
      `Districts seeded for city ${city.id}`
    )
    
  }

}

async function runSeeder() {

  try {
    await seedProvinces()
    await seedCities()
    await seedDistricts()

    console.log("Seeding completed")

  } catch (err) {

    console.error(err)

  } finally {

    await sequelize.close()

  }

}

runSeeder()