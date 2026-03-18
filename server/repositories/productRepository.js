const { Op, fn, col } = require('sequelize');
const { Product, ProductCategory, ProductUnit, ProductDetailMedia, OrderItem, Order } = require('../models');

const productRepository = {

  findAll({ activeOnly = true, categoryId, priceSort = 'default' } = {}) {
    const where = activeOnly ? { active: true } : {};
    if (categoryId !== undefined && categoryId !== null) {
      where.categoryId = Number(categoryId);
    }

    const order = [];
    if (priceSort === 'asc') {
      order.push([{ model: ProductUnit, as: 'defaultUnit' }, 'price', 'ASC']);
    }
    if (priceSort === 'desc') {
      order.push([{ model: ProductUnit, as: 'defaultUnit' }, 'price', 'DESC']);
    }
    order.push(['id', 'ASC']);

    return Product.findAll({
      where,
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }, {
        model: ProductDetailMedia,
        as: 'detailMedia',
        required: false,
        separate: true,
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      }],
      order,
      distinct: true,
    });
  },

  findById(id) {
    return Product.findByPk(id, {
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }, {
        model: ProductDetailMedia,
        as: 'detailMedia',
        required: false,
        separate: true,
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      }],
    });
  },

  async findFeatured(limit = 3) {
    const topSoldRows = await OrderItem.findAll({
      attributes: [
        'productId',
        [fn('SUM', col('OrderItem.qty')), 'units_sold'],
      ],
      include: [
        {
          model: Order,
          as: 'order',
          attributes: [],
          where: { status: { [Op.ne]: 'cancelled' } },
          required: true,
        },
        {
          model: Product,
          as: 'product',
          attributes: [],
          where: { active: true },
          required: true,
        },
      ],
      group: ['OrderItem.product_id'],
      order: [[fn('SUM', col('OrderItem.qty')), 'DESC']],
      limit: limit,
      raw: true,
    });

    const topSoldProductIds = topSoldRows.map((row) => Number(row.productId)).filter(Boolean);

    if (!topSoldProductIds.length) {
      return this.findAll({ activeOnly: true }).then((rows) => rows.slice(0, limit));
    }

    const featuredProducts = await Product.findAll({
      where: {
        id: { [Op.in]: topSoldProductIds },
        active: true,
      },
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }, {
        model: ProductDetailMedia,
        as: 'detailMedia',
        required: false,
        separate: true,
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      }],
      distinct: true,
    });

    const byId = new Map(featuredProducts.map((item) => [Number(item.id), item]));
    const orderedFeatured = topSoldProductIds.map((id) => byId.get(id)).filter(Boolean);

    if (orderedFeatured.length >= limit) {
      return orderedFeatured.slice(0, limit);
    }

    const remaining = limit - orderedFeatured.length;
    const fallbackProducts = await Product.findAll({
      where: {
        active: true,
        id: { [Op.notIn]: topSoldProductIds },
      },
      include: [{
        model: ProductCategory,
        as: 'category',
        attributes: ['id', 'name'],
        required: false,
      }, {
        model: ProductUnit,
        as: 'defaultUnit',
        required: false,
        where: {
          unitCode: 'pcs',
          active: true,
        },
      }, {
        model: ProductUnit,
        as: 'units',
        required: false,
        where: { active: true },
        separate: true,
      }, {
        model: ProductDetailMedia,
        as: 'detailMedia',
        required: false,
        separate: true,
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      }],
      order: [['id', 'ASC']],
      distinct: true,
      limit: remaining,
    });

    return [...orderedFeatured, ...fallbackProducts];
  },

  create(data, transaction) {
    return Product.create(data, { transaction });
  },

  async update(id, data, transaction) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update(data, { transaction });
  },

  async softDelete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return product.update({ active: false });
  },

  // ── Stats queries ─────────────────────────────────────────────────────────
  countActive() {
    return Product.count({ where: { active: true } });
  },

  countLowStock(threshold = 20) {
    return Product.count({ where: { active: true, stock: { [Op.lt]: threshold } } });
  },

  decrementStock(id, qty, transaction) {
    return Product.decrement('stock', { by: qty, where: { id }, transaction });
  },

  incrementStock(id, qty, transaction) {
    return Product.increment('stock', { by: qty, where: { id }, transaction });
  },

  findUnitById(id) {
    return ProductUnit.findByPk(id);
  },

  findUnit(productId, unitCode) {
    return ProductUnit.findOne({
      where: {
        productId,
        unitCode,
        active: true,
      },
      order: [['id', 'ASC']],
    });
  },

  findFirstUnit(productId) {
    return ProductUnit.findOne({
      where: {
        productId,
        active: true,
      },
      order: [['id', 'ASC']],
    });
  },

  upsertUnit(data, transaction) {
    return ProductUnit.upsert(data, { transaction });
  },

  async replaceDetailMedia(productId, detailMedia, transaction) {
    await ProductDetailMedia.destroy({
      where: { productId },
      transaction,
    });

    if (!Array.isArray(detailMedia) || !detailMedia.length) {
      return [];
    }

    return ProductDetailMedia.bulkCreate(
      detailMedia.map((item, index) => ({
        productId,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        sortOrder: Number(item.sortOrder || index + 1),
      })),
      { transaction }
    );
  },
};

module.exports = productRepository;
