'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('payment_methods', [
      {
        code: 'cod',
        name: 'Bayar di Tempat (COD)',
        description: 'Bayar langsung saat barang diterima',
        account_number: '',
        account_name: '',
        type: 'cod',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'qris',
        name: 'QRIS',
        type: 'qris',
        description: 'Scan QR untuk pembayaran instant',
        account_number: '',
        account_name: '',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'bank_bca',
        name: 'Bank BCA',
        type: 'bank',
        description: 'Transfer ke rekening kami',
        account_number: '1132648373',
        account_name: 'Sri Wahyuningrum',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'bank_jatim',
        name: 'Bank Jatim',
        type: 'bank',
        description: 'Transfer ke rekening kami',
        account_number: '0112592237',
        account_name: 'Sri Wahyuningrum',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'bank_bri',
        name: 'Bank BRI',
        type: 'bank',
        description: 'Transfer ke rekening kami',
        account_number: '624701005920500',
        account_name: 'Hari Purnomo',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('payment_methods', null, {});
  }
};