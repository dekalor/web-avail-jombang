'use strict';

const testimonialRepository = require('../repositories/testimonialRepository');

function formatTestimonial(item) {
  if (!item) return null;
  const raw = item.toJSON ? item.toJSON() : item;
  return {
    id: raw.id,
    customerName: raw.customerName,
    title: raw.title || '',
    caption: raw.caption || '',
    type: raw.mediaType,
    mediaType: raw.mediaType,
    mediaUrl: raw.mediaUrl,
    sortOrder: raw.sortOrder,
    active: raw.active,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

const testimonialService = {
  async getAllTestimonials({ activeOnly = true } = {}) {
    const records = await testimonialRepository.findAll({ activeOnly });
    return records.map(formatTestimonial);
  },

  async getTestimonialById(id) {
    const record = await testimonialRepository.findById(id);
    if (!record) {
      const err = new Error('Testimonial not found');
      err.status = 404;
      throw err;
    }
    return formatTestimonial(record);
  },

  async createTestimonial(payload) {
    const data = {
      customerName: String(payload.customerName || '').trim(),
      title: payload.title ? String(payload.title).trim() : null,
      caption: payload.caption ? String(payload.caption).trim() : null,
      mediaType: payload.mediaType || payload.type || 'image',
      mediaUrl: String(payload.mediaUrl || '').trim(),
      sortOrder: Number.isFinite(+payload.sortOrder) ? +payload.sortOrder : 1,
      active: payload.active !== false && payload.active !== 0 && payload.active !== '0',
    };

    if (!data.customerName) {
      const err = new Error('Customer name is required');
      err.status = 400;
      throw err;
    }

    if (!data.mediaUrl) {
      const err = new Error('Media URL is required');
      err.status = 400;
      throw err;
    }

    const created = await testimonialRepository.create(data);
    return formatTestimonial(created);
  },

  async updateTestimonial(id, payload) {
    const existing = await testimonialRepository.findById(id);
    if (!existing) {
      const err = new Error('Testimonial not found');
      err.status = 404;
      throw err;
    }

    const updates = {};
    if (payload.customerName !== undefined) updates.customerName = String(payload.customerName).trim();
    if (payload.title !== undefined) updates.title = payload.title ? String(payload.title).trim() : null;
    if (payload.caption !== undefined) updates.caption = payload.caption ? String(payload.caption).trim() : null;
    if (payload.mediaType !== undefined || payload.type !== undefined) {
      updates.mediaType = payload.mediaType || payload.type;
    }
    if (payload.mediaUrl !== undefined) updates.mediaUrl = String(payload.mediaUrl).trim();
    if (payload.sortOrder !== undefined) updates.sortOrder = +payload.sortOrder;
    if (payload.active !== undefined) {
      updates.active = payload.active === true || payload.active === 1 || payload.active === '1';
    }

    const updated = await testimonialRepository.update(id, updates);
    return formatTestimonial(updated);
  },

  async deactivateTestimonial(id) {
    const updated = await testimonialRepository.deactivate(id);
    if (!updated) {
      const err = new Error('Testimonial not found');
      err.status = 404;
      throw err;
    }
    return formatTestimonial(updated);
  },

  async deleteTestimonial(id) {
    const deleted = await testimonialRepository.delete(id);
    if (!deleted) {
      const err = new Error('Testimonial not found');
      err.status = 404;
      throw err;
    }
    return true;
  },
};

module.exports = testimonialService;
