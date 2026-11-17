'use strict';

const initialTestimonials = [
  {
    customer_name: 'Kristiani Apu',
    title: 'Ulasan pelanggan',
    caption: 'Mengidap Mioma sampai hampir angkat rahim & sembuh setelah pakai FC Sanitary Pad',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_1_gdk0cs.jpg',
    sort_order: 1,
    active: true,
  },
  {
    customer_name: 'Siti Masruroh',
    title: 'Ulasan pelanggan',
    caption: 'Menstruasi tidak lancar karena PCOS kini kembali normal',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_2_m0xpmp.jpg',
    sort_order: 2,
    active: true,
  },
  {
    customer_name: 'Konsumen',
    title: 'Cerita pengalaman',
    caption: 'Istri dan anak-anak nya sering konsultasi ke dokter masalah kewanitaan, setelah pakai FC Sanitary Pad sudah tidak pernah ke dokter lagi',
    media_type: 'video',
    media_url: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946819/Testimonial_3_y3itsb.mp4',
    sort_order: 3,
    active: true,
  },
  {
    customer_name: 'Selebriti Indonesia',
    title: 'Cerita pengalaman',
    caption: 'Para selebriti yang menggunakan AVAIL sehari-hari (bukan endorse)',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_4_dq3uso.jpg',
    sort_order: 4,
    active: true,
  },
  {
    customer_name: 'Ahan Suryadi - Garut',
    title: 'Cerita pengalaman',
    caption: 'Karena pernah operasi dan radiasi di kepala mengakibatkan aktifitas seksual kurang maksimal, setelah mengkonsumsi AVAIL A Cafe aktifitas seksual bisa kembali maksimal',
    media_type: 'video',
    media_url: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946824/Testimonial_5_rgrdna.mp4',
    sort_order: 5,
    active: true,
  },
  {
    customer_name: 'Syifatun - Trenggalek',
    title: 'Ulasan pelanggan',
    caption: 'Gangguan lambung membaik setelah mengkonsumsi Nutrashake',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946820/Testimonial_6_kpacsq.jpg',
    sort_order: 6,
    active: true,
  },
  {
    customer_name: 'Sari - Nutrisionis Avail',
    title: 'Ulasan pelanggan',
    caption: 'Pernah tau Gerd ya? Penyakit lambung.. Apakah nutrashake bisa menjadi solusi bagi orang-orang yg bermasalah dengan lambung.. kebetulan saya tanya sama Mbak Sari. Mbak Sari ini tandem nya Dr.Erina (dokter AVAIL) sebagai nutrisionis AVAIL. Sangat sangat mempuni Lulusan UI.',
    media_type: 'video',
    media_url: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946823/Testimonial_7_li7no1.mp4',
    sort_order: 7,
    active: true,
  },
  {
    customer_name: 'Anisa Prasasti',
    title: 'Ulasan pelanggan',
    caption: 'Nutrashake hempas kolesterol',
    media_type: 'image',
    media_url: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946823/Testimonial_8_mnqi7b.jpg',
    sort_order: 8,
    active: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('testimonials', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      customer_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      caption: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media_type: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'image',
      },
      media_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('testimonials', ['active']);
    await queryInterface.addIndex('testimonials', ['sort_order']);
    await queryInterface.addIndex('testimonials', ['media_type']);

    const records = initialTestimonials.map(t => ({
      ...t,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('testimonials', records);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('testimonials');
  },
};
