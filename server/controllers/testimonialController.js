'use strict';

const testimonialService = require('../services/testimonialService');

const testimonialController = {
  async index(req, res, next) {
    try {
      const testimonials = await testimonialService.getAllTestimonials({ activeOnly: true });
      res.json({ success: true, data: testimonials });
    } catch (err) {
      next(err);
    }
  },

  async show(req, res, next) {
    try {
      const testimonial = await testimonialService.getTestimonialById(req.params.id);
      res.json({ success: true, data: testimonial });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = testimonialController;
