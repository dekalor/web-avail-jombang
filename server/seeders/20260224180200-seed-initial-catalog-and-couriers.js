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
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945586/avail/products/product-1772945583835-1u8co1.png',
        stock: 50,
      },
      {
        name: 'Avail FC Night Use',
        description: 'Dipakai saat haid malam hari, pembalut untuk nifas setelah melahirkan',
        category_id: 1,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945656/FC_Night_Use_N9_xilag3.png',
        stock: 50,
      },
      {
        name: 'Avail FC Day Use',
        description: 'Dipakai saat haid siang hari',
        category_id: 1,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945656/FC_Day_Use_D10_gmheqx.png',
        stock: 50,
      },
      {
        name: 'Avail FC Kombinasi',
        description: '1 pack berisi kombinasi 3 day use, night use dan pantiliner',
        category_id: 1,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945655/FC_Combination_C9_h2kcir.png',
        stock: 50,
      },
      {
        name: 'Avail A Cafe',
        description: 'Minuman serbuk kopi dengan berbagai kandungan bahan alami yang dapat membantu meningkatkan stamina tubuh dan berkhasia untuk mengatasi masalah gangguan seksual pria',
        category_id: 2,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945658/product-1771487886152-dely3x_k93gwz.png',
        stock: 50,
      },
      {
        name: 'Avail Nutrashake (ANS)',
        description: 'Suplemen serat alami yang sangat dibutuhkan oleh tubuh, terutama dalam mendukung fungsi dan kesehatan pencernaan.',
        category_id: 2,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946389/Nutrashake_zwinnc.png',
        stock: 50,
      },
      {
        name: 'Avail Nutracella (ANC)',
        description: 'ANC mengandung kombinasi bahan-bahan alami bermanfaat bagi kesehatan tubuh, yaitu Klorofil, Spirulina, Green Tea, Glutathione, Double Stem Cell, Collagen Ikan, Ekstrak Mix Berry, FOS',
        category_id: 2,
        image_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772945655/ANC_olpcrq.png',
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

    await queryInterface.bulkInsert('product_detail_medias', [
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958501/fc_day_use_detail_01_wnnkh1.png', sort_order: 1},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_02_ae94hb.png', sort_order: 2},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_03_dqweam.png', sort_order: 3},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772966964/fc_pantyliner_detail_04_ppcxq5.png', sort_order: 4},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958495/Q_A_FCSanitaryPad_01_pwj0ds.png', sort_order: 5},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958498/Q_A_FCSanitaryPad_02_e9bygj.png', sort_order: 6},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967070/Q_A_FCSanitaryPad_03_zxyzoy.png', sort_order: 7},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_04_v0siqg.png', sort_order: 8},
      { product_id: productMap.get('Avail FC Pantiliner'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_05_fwbau0.png', sort_order: 9},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958501/fc_day_use_detail_01_wnnkh1.png', sort_order: 1},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_02_ae94hb.png', sort_order: 2},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_03_dqweam.png', sort_order: 3},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772966963/fc_night_use_detail_04_u5p8i1.png', sort_order: 4},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958495/Q_A_FCSanitaryPad_01_pwj0ds.png', sort_order: 5},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958498/Q_A_FCSanitaryPad_02_e9bygj.png', sort_order: 6},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967070/Q_A_FCSanitaryPad_03_zxyzoy.png', sort_order: 7},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_04_v0siqg.png', sort_order: 8},
      { product_id: productMap.get('Avail FC Night Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_05_fwbau0.png', sort_order: 9},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958501/fc_day_use_detail_01_wnnkh1.png', sort_order: 1},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_02_ae94hb.png', sort_order: 2},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_03_dqweam.png', sort_order: 3},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958493/fc_day_use_detail_04_r2rujv.png', sort_order: 4},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958495/Q_A_FCSanitaryPad_01_pwj0ds.png', sort_order: 5},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958498/Q_A_FCSanitaryPad_02_e9bygj.png', sort_order: 6},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967070/Q_A_FCSanitaryPad_03_zxyzoy.png', sort_order: 7},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_04_v0siqg.png', sort_order: 8},
      { product_id: productMap.get('Avail FC Day Use'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_05_fwbau0.png', sort_order: 9},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958501/fc_day_use_detail_01_wnnkh1.png', sort_order: 1},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_02_ae94hb.png', sort_order: 2},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958494/fc_day_use_detail_03_dqweam.png', sort_order: 3},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958495/Q_A_FCSanitaryPad_01_pwj0ds.png', sort_order: 4},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772958498/Q_A_FCSanitaryPad_02_e9bygj.png', sort_order: 5},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967070/Q_A_FCSanitaryPad_03_zxyzoy.png', sort_order: 6},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_04_v0siqg.png', sort_order: 7},
      { product_id: productMap.get('Avail FC Kombinasi'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967071/Q_A_FCSanitaryPad_05_fwbau0.png', sort_order: 8},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967215/acafe_detail_01_lro0rw.png', sort_order: 1},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967216/acafe_detail_02_hvu9ek.png', sort_order: 2},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967217/acafe_detail_03_fzh8k3.png', sort_order: 3},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967218/acafe_detail_04_tcnbqq.png', sort_order: 4},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967219/acafe_detail_05_e4rk7t.png', sort_order: 5},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967171/Q_A_ACAFE_1_k1dghp.png', sort_order: 5},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967171/Q_A_ACAFE_2_tpfuyb.png', sort_order: 6},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967172/Q_A_ACAFE_3_uwwluv.png', sort_order: 7},
      { product_id: productMap.get('Avail A Cafe'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967173/Q_A_ACAFE_4_f9aneu.png', sort_order: 8},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967225/ANS_01_xofair.png', sort_order: 1},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967226/ANS_02_d3sw1r.png', sort_order: 2},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967227/ANS_03_n8ebnj.png', sort_order: 3},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967228/ANS_05_d7wghu.png', sort_order: 4},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967182/Q_A_ANS_01_rnozv7.png', sort_order: 5},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967183/Q_A_ANS_02_bm4xbh.png', sort_order: 6},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967184/Q_A_ANS_03_pptro2.png', sort_order: 7},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967185/Q_A_ANS_04_evhvc3.png', sort_order: 8},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967185/Q_A_ANS_05_uggmf5.png', sort_order: 9},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967186/Q_A_ANS_06_ij4jwz.png', sort_order: 10},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967187/Q_A_ANS_07_vzfd7m.png', sort_order: 11},
      { product_id: productMap.get('Avail Nutrashake (ANS)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967188/Q_A_ANS_08_uproi2.png', sort_order: 12},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967220/anc_detail_01_zq2m4k.png', sort_order: 1},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967221/anc_detail_02_ldb9ae.png', sort_order: 2},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967222/anc_detail_03_hb85xq.png', sort_order: 3},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967223/anc_detail_04_soqcxd.png', sort_order: 4},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967224/anc_detail_05_ow20wz.png', sort_order: 5},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967173/Q_A_ANC_01_uvb2fy.png', sort_order: 6},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967174/Q_A_ANC_02_fhwzk3.png', sort_order: 7},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967174/Q_A_ANC_03_zpyert.png', sort_order: 8},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967175/Q_A_ANC_05_m31xry.png', sort_order: 9},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967176/Q_A_ANC_06_xy9hd1.png', sort_order: 10},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967177/Q_A_ANC_07_agpwdc.png', sort_order: 11},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967178/Q_A_ANC_08_r0gwzw.png', sort_order: 12},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967179/Q_A_ANC_09_rfdytx.png', sort_order: 13},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967180/Q_A_ANC_10_cetwlm.png', sort_order: 14},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967180/Q_A_ANC_11_ajkf7r.png', sort_order: 15},
      { product_id: productMap.get('Avail Nutracella (ANC)'), media_type: 'image', media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772967181/Q_A_ANC_12_jdqao1.png', sort_order: 16},
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
