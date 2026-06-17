require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const createApp = require('../server/app');

let app = null;

module.exports = async (req, res) => {
  if (!app) app = await createApp();
  app(req, res);
};
