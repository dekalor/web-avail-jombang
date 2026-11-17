'use strict';

const { Testimonial } = require('../models');

const testimonialRepository = {
  findAll({ activeOnly = true } = {}) {
    const where = activeOnly ? { active: true } : {};
    return Testimonial.findAll({
      where,
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
  },

  findById(id) {
    return Testimonial.findByPk(id);
  },

  create(data) {
    return Testimonial.create(data);
  },

  async update(id, data) {
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) return null;
    return testimonial.update(data);
  },

  async deactivate(id) {
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) return null;
    return testimonial.update({ active: false });
  },

  async delete(id) {
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) return null;
    return testimonial.destroy();
  },
};

module.exports = testimonialRepository;
