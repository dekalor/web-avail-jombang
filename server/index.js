require('dotenv').config()
const createApp            = require('./app');
const { sequelize }        = require('./db/index');
const { PORT }             = require('./config/config');

async function start() {
  // Sync Sequelize models with the DB (alter: true updates columns safely)
  await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });

  const app = await createApp();
  app.listen(PORT, () => {
    const isDev = process.env.NODE_ENV !== 'production';
    console.log(`🌱 Avail Jombang → http://localhost:${PORT}`);
    if (isDev) {
      console.log(`   Store  → http://localhost:${PORT}/`);
      console.log(`   Admin  → http://localhost:${PORT}/admin/`);
    }
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
