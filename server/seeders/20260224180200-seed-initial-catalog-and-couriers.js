'use strict';

module.exports = {
  async up(queryInterface) {
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
        name: 'Day Use (4 BUNGKUS)',
        description: 'Dipakai saat haid siang hari',
        category_id: 1,
        price: 140000,
        image_url: '/uploads/products/DC_Day_Use_4_PACK.png',
        stock: 50,
        weight: 200,
      },
      {
        name: 'Night Use (4 BUNGKUS)',
        description: 'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        category_id: 1,
        price: 155000,
        image_url: '/uploads/products/FC_Night_Use_4_PACK.png',
        stock: 50,
        weight: 200,
      },
      {
        name: 'Pantiliner (4 BUNGKUS)',
        description: 'Dipakai sehari-hari saat tidak haid, keputihan, wanita yang sudah menopause',
        category_id: 1,
        price: 125000,
        image_url: '/uploads/products/FC_Pantiliner_4_PACK.png',
        stock: 50,
        weight: 175,
      },
      {
        name: 'Pantiliner (1 BALL)',
        description: 'Dipakai sehari-hari saat tidak haid, keputihan, wanita yang sudah menopause',
        category_id: 1,
        price: 310000,
        image_url: '/uploads/products/FC_Pantiliner_P10.png',
        stock: 50,
        weight: 500,
      },
      {
        name: 'Night Use (1 BALL)',
        description: 'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        category_id: 1,
        price: 310000,
        image_url: '/uploads/products/FC_Night_Use_N9.png',
        stock: 50,
        weight: 500,
      },
      {
        name: 'Day Use (1 BALL)',
        description: 'Dipakai saat haid siang hari',
        category_id: 1,
        price: 345000,
        image_url: '/uploads/products/FC_Day_Use_D10.png',
        stock: 50,
        weight: 500,
      },
      {
        name: 'Combination (1 BALL)',
        description: '1 pack berisi kombinasi 3 day use, night use dan pantiliner',
        category_id: 1,
        price: 312000,
        image_url: '/uploads/products/FC_Combination_C9.png',
        stock: 50,
        weight: 600,
      },
      {
        name: 'Avail A Cafe',
        description: 'Minuman serbuk kopi dengan berbagai kandungan bahan alami yang dapat membantu meningkatkan stamina tubuh dan berkhasia untuk mengatasi masalah gangguan seksual pria',
        category_id: 2,
        price: 250000,
        image_url: '/uploads/products/product-1771487886152-dely3x.png',
        stock: 50,
        weight: 600,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', {
      name: {
        [Sequelize.Op.in]: [
          'Day Use (4 BUNGKUS)',
          'Night Use (4 BUNGKUS)',
          'Pantiliner (4 BUNGKUS)',
          'Pantiliner (1 BALL)',
          'Night Use (1 BALL)',
          'Day Use (1 BALL)',
          'Combination (1 BALL)',
          'Avail A Cafe',
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

