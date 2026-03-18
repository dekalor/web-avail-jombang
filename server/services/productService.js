const productRepository = require('../repositories/productRepository');
const productCategoryRepository = require('../repositories/productCategoryRepository');
const db = require('../models');

function normalizeProduct(product) {
  if (!product) return null;
  const raw = product.toJSON();
  const defaultUnit =
    raw.defaultUnit ||
    raw.units?.find((unit) => unit.unitCode === 'pcs') ||
    raw.units?.[0];

  return {
    ...raw,
    price: defaultUnit?.price ?? 0,
    weight: defaultUnit?.weight ?? 0,
    qtyPerUnit: defaultUnit?.qtyPerUnit ?? 1,
    unitCode: defaultUnit?.unitCode ?? null,
    detailMedia: Array.isArray(raw.detailMedia)
      ? [...raw.detailMedia].sort((a, b) =>
        Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
        || Number(a.id || 0) - Number(b.id || 0))
      : [],
  };
}

const productService = {

  async getAllProducts({ activeOnly = true, categoryId, priceSort = 'default' } = {}) {
    const products = await productRepository.findAll({ activeOnly, categoryId, priceSort });
    return products.map(normalizeProduct);
  },

  async getFeaturedProducts(limit = 3) {
    const products = await productRepository.findFeatured(limit);
    return products.map(normalizeProduct);
  },

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    return normalizeProduct(product);
  },

  async createProduct({ name, description, categoryId, category_id, price, imageUrl, badge, stock, weight, unitCode, units, detailMedia }) {
    if (!name) {
      throw Object.assign(new Error('name is required'), { status: 400 });
    }

    const hasUnitsPayload = Array.isArray(units) && units.length > 0
    if (!hasUnitsPayload) {
      const parsedPrice = +price
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        throw Object.assign(new Error('price is invalid'), { status: 400 })
      }
    }

    const created = await db.sequelize.transaction(async (transaction) => {
      const product = await productRepository.create({
        name,
        description: description || '',
        categoryId: +(categoryId || category_id || 1),
        imageUrl: imageUrl || null,
        badge: badge || null,
        stock: +stock || 100,
        active: true,
      }, transaction);

      if (Array.isArray(units) && units.length > 0) {
        for (const unit of units) {
          if (!unit?.unitCode || unit.price === undefined) continue;
          const normalizedUnitCode = String(unit.unitCode).toLowerCase();
          await productRepository.upsertUnit({
            productId: product.id,
            unitCode: normalizedUnitCode,
            label: unit.label || normalizedUnitCode.toUpperCase(),
            price: +unit.price,
            weight: +unit.weight || (+weight || 100),
            qtyPerUnit: +unit.qtyPerUnit || 1,
            active: unit.active !== false,
          }, transaction);
        }
      } else {
        const parsedPrice = +price
        const fallbackUnitCode = String(unitCode || 'pcs').toLowerCase();
        await productRepository.upsertUnit({
          productId: product.id,
          unitCode: fallbackUnitCode,
          label: String(fallbackUnitCode).toUpperCase(),
          price: parsedPrice,
          weight: +weight || 100,
          qtyPerUnit: 1,
          active: true,
        }, transaction);
      }

      if (Array.isArray(detailMedia)) {
        const normalizedDetailMedia = detailMedia
          .map((item, index) => ({
            mediaType: String(item.mediaType || '').toLowerCase(),
            mediaUrl: String(item.mediaUrl || '').trim(),
            sortOrder: Number(item.sortOrder || index + 1),
          }))
          .filter((item) =>
            item.mediaUrl
            && (item.mediaType === 'image' || item.mediaType === 'video')
          );

        await productRepository.replaceDetailMedia(product.id, normalizedDetailMedia, transaction);
      }

      return product.id;
    });

    const product = await productRepository.findById(created);
    return {
      ...normalizeProduct(product),
      category: {
        name: (await productCategoryRepository.findById(product.categoryId)).name,
      },
    };
  },

  async updateProduct(id, fields) {
    const patch = {};
    if (fields.name !== undefined) patch.name = fields.name;
    if (fields.description !== undefined) patch.description = fields.description;
    if (fields.categoryId !== undefined) patch.categoryId = +fields.categoryId;
    if (fields.category_id !== undefined) patch.categoryId = +fields.category_id;
    if (fields.imageUrl !== undefined) patch.imageUrl = fields.imageUrl || null;
    if (fields.badge !== undefined) patch.badge = fields.badge || null;
    if (fields.stock !== undefined) patch.stock = +fields.stock;
    if (fields.active !== undefined) patch.active = !!+fields.active;

    await db.sequelize.transaction(async (transaction) => {
      const product = await productRepository.update(id, patch, transaction);
      if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });

      if (fields.price !== undefined) {
        const current = await productRepository.findUnit(+id, 'pcs')
          || await productRepository.findFirstUnit(+id);

        const targetUnitCode = current?.unitCode || String(fields.unitCode || 'pcs').toLowerCase();
        await productRepository.upsertUnit({
          productId: +id,
          unitCode: targetUnitCode,
          label: current?.label || targetUnitCode.toUpperCase(),
          price: +fields.price,
          weight: fields.weight !== undefined
            ? +fields.weight
            : (current?.weight || 100),
          qtyPerUnit: current?.qtyPerUnit || 1,
          active: current ? current.active !== false : true,
        }, transaction);
      } else if (fields.weight !== undefined) {
        const current = await productRepository.findUnit(+id, 'pcs')
          || await productRepository.findFirstUnit(+id);
        if (current) {
          await productRepository.upsertUnit({
            productId: +id,
            unitCode: current.unitCode,
            label: current.label || 'PCS',
            price: +current.price,
            weight: +fields.weight,
            qtyPerUnit: current.qtyPerUnit || 1,
            active: current.active !== false,
          }, transaction);
        }
      }

      if (Array.isArray(fields.units)) {
        for (const unit of fields.units) {
          if (!unit?.unitCode) continue;
          const unitCode = String(unit.unitCode).toLowerCase();
          await productRepository.upsertUnit({
            productId: +id,
            unitCode,
            label: unit.label || unitCode.toUpperCase(),
            price: +unit.price,
            weight: +unit.weight || (+fields.weight || 100),
            qtyPerUnit: +unit.qtyPerUnit || 1,
            active: unit.active !== false,
          }, transaction);
        }
      }

      if (Array.isArray(fields.detailMedia)) {
        const normalizedDetailMedia = fields.detailMedia
          .map((item, index) => ({
            mediaType: String(item.mediaType || '').toLowerCase(),
            mediaUrl: String(item.mediaUrl || '').trim(),
            sortOrder: Number(item.sortOrder || index + 1),
          }))
          .filter((item) =>
            item.mediaUrl
            && (item.mediaType === 'image' || item.mediaType === 'video')
          );

        await productRepository.replaceDetailMedia(+id, normalizedDetailMedia, transaction);
      }
    });

    const product = await productRepository.findById(id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });

    return {
      ...normalizeProduct(product),
      category: {
        name: (await productCategoryRepository.findById(product.categoryId)).name,
      },
    };
  },

  async deactivateProduct(id) {
    const product = await productRepository.softDelete(id);
    if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
    return product;
  },

  async getProductStats() {
    const [total, lowStock] = await Promise.all([
      productRepository.countActive(),
      productRepository.countLowStock(),
    ]);
    return { total, low_stock: lowStock };
  },
};

module.exports = productService;
