const session = require('express-session');
const { AdminSession } = require('../db/index');

class SequelizeSessionStore extends session.Store {
  get(sid, callback) {
    AdminSession.findByPk(sid)
      .then(row => {
        if (!row) return callback(null, null);
        if (row.expires && row.expires.getTime() <= Date.now()) {
          return AdminSession.destroy({ where: { sid } }).then(() => callback(null, null));
        }

        try {
          return callback(null, row.data ? JSON.parse(row.data) : null);
        } catch (err) {
          return callback(err);
        }
      })
      .catch(err => callback(err));
  }

  set(sid, sessionData, callback) {
    const expires = sessionData?.cookie?.expires ? new Date(sessionData.cookie.expires) : null;
    const data = JSON.stringify(sessionData || {});

    AdminSession.upsert({ sid, expires, data })
      .then(() => callback?.(null))
      .catch(err => callback?.(err));
  }

  destroy(sid, callback) {
    AdminSession.destroy({ where: { sid } })
      .then(() => callback?.(null))
      .catch(err => callback?.(err));
  }

  touch(sid, sessionData, callback) {
    const expires = sessionData?.cookie?.expires ? new Date(sessionData.cookie.expires) : null;

    AdminSession.update({ expires }, { where: { sid } })
      .then(() => callback?.(null))
      .catch(err => callback?.(err));
  }
}

module.exports = SequelizeSessionStore;
