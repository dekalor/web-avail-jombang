'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('couriers', [
      { code: 'jne', name: 'JNE Express' },
      { code: 'jnt', name: 'J&T Express' },
      { code: 'pos', name: 'POS Indonesia (POS)' },
    ]);

    await queryInterface.bulkInsert('product_categories', [
      { name: 'FC Sanitary Pad' },
      { name: 'Health Food' },
    ]);

    await queryInterface.bulkInsert('products', [
      {
        name: 'Avail FC Pantiliner',
        description: 'Dipakai sehari-hari saat tidak haid, keputihan, wanita yang sudah menopause',
        category_id: 1,
        image_url: '/uploads/products/FC_Pantiliner_P10.png',
        stock: 50,
      },
      {
        name: 'Avail FC Night Use',
        description: 'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        category_id: 1,
        image_url: '/uploads/products/FC_Night_Use_N9.png',
        stock: 50,
      },
      {
        name: 'Avail FC Day Use',
        description: 'Dipakai saat haid siang hari',
        category_id: 1,
        image_url: '/uploads/products/FC_Day_Use_D10.png',
        stock: 50,
      },
      {
        name: 'Avail FC Kombinasi',
        description: '1 pack berisi kombinasi 3 day use, night use dan pantiliner',
        category_id: 1,
        image_url: '/uploads/products/FC_Combination_C9.png',
        stock: 50,
      },
      {
        name: 'Avail A Cafe',
        description: 'Minuman serbuk kopi dengan berbagai kandungan bahan alami yang dapat membantu meningkatkan stamina tubuh dan berkhasia untuk mengatasi masalah gangguan seksual pria',
        category_id: 2,
        image_url: '/uploads/products/product-1771487886152-dely3x.png',
        stock: 50,
      },
      {
        name: 'Avail Nutrashake (ANS)',
        description: 'Suplemen serat alami yang sangat dibutuhkan oleh tubuh, terutama dalam mendukung fungsi dan kesehatan pencernaan.',
        category_id: 2,
        image_url: '/uploads/products/Nutrashake.png',
        stock: 50,
      },
      {
        name: 'Avail Nutracella (ANC)',
        description: 'ANC mengandung kombinasi bahan-bahan alami bermanfaat bagi kesehatan tubuh, yaitu Klorofil, Spirulina, Green Tea, Glutathione, Double Stem Cell, Collagen Ikan, Ekstrak Mix Berry, FOS',
        category_id: 2,
        image_url: '/uploads/products/ANC.png',
        stock: 50,
      },
    ]);

    const productNames = [
      'Avail FC Pantiliner',
      'Avail FC Night Use',
      'Avail FC Day Use',
      'Avail FC Kombinasi',
      'Avail A Cafe',
      'Avail Nutrashake (ANS)',
      'Avail Nutracella (ANC)'
    ];

    const [rows] = await queryInterface.sequelize.query(
      'SELECT id, name FROM products WHERE name IN (:productNames)',
      {
        replacements: { productNames },
      }
    );

    const productMap = new Map(rows.map((row) => [row.name, row.id]));

    await queryInterface.bulkInsert('product_units', [
      { product_id: productMap.get('Avail FC Pantiliner'), unit_code: 'pcs', label: 'PCS', price: 35000, weight: 50, qty_per_unit: 1 },
      { product_id: productMap.get('Avail FC Pantiliner'), unit_code: 'ball', label: 'BALL', price: 310000, weight: 500, qty_per_unit: 10 },
      { product_id: productMap.get('Avail FC Night Use'), unit_code: 'pcs', label: 'PCS', price: 40000, weight: 50, qty_per_unit: 1 },
      { product_id: productMap.get('Avail FC Night Use'), unit_code: 'ball', label: 'BALL', price: 310000, weight: 500, qty_per_unit: 8 },
      { product_id: productMap.get('Avail FC Day Use'), unit_code: 'pcs', label: 'PCS', price: 38000, weight: 50, qty_per_unit: 1 },
      { product_id: productMap.get('Avail FC Day Use'), unit_code: 'ball', label: 'BALL', price: 345000, weight: 500, qty_per_unit: 10 },
      { product_id: productMap.get('Avail FC Kombinasi'), unit_code: 'ball', label: 'BALL', price: 312000, weight: 600, qty_per_unit: 1 },
      { product_id: productMap.get('Avail A Cafe'), unit_code: 'box', label: 'BOX', price: 265000, weight: 150, qty_per_unit: 1 },
      { product_id: productMap.get('Avail Nutrashake (ANS)'), unit_code: 'box', label: 'BOX', price: 335000, weight: 80, qty_per_unit: 1 },
      { product_id: productMap.get('Avail Nutracella (ANC)'), unit_code: 'box', label: 'BOX', price: 550000, weight: 80, qty_per_unit: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('product_units', {
      unit_code: {
        [Sequelize.Op.in]: ['pcs', 'ball', 'box'],
      },
    });

    await queryInterface.bulkDelete('products', {
      name: {
        [Sequelize.Op.in]: [
          'Avail FC Pantiliner',
          'Avail FC Night Use',
          'Avail FC Day Use',
          'Avail FC Kombinasi',
          'Avail A Cafe',
          'Avail Nutrashake (ANS)',
          'Avail Nutracella (ANC)'
        ],
      },
    });

    await queryInterface.bulkDelete('product_categories', {
      name: {
        [Sequelize.Op.in]: ['FC Sanitary Pad', 'Health Food'],
      },
    });

    await queryInterface.bulkDelete('couriers', {
      code: {
        [Sequelize.Op.in]: ['jne', 'jnt', 'pos'],
      },
    });
  },
};
