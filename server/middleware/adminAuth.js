// server/middleware/adminAuth.js
// Session-based auth for the admin API using express-session + DB store.

const { ADMIN } = require('../config/env');

// POST /api/admin/login
function login(req, res) {
  const { username, password } = req.body;
  if (username !== ADMIN.USERNAME || password !== ADMIN.PASSWORD) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  req.session.regenerate(err => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to start session' });

    req.session.isAdmin = true;
    req.session.adminUsername = username;
    req.session.save(saveErr => {
      if (saveErr) {
        return res.status(500).json({ success: false, message: 'Failed to persist session' });
      }
      return res.json({ success: true });
    });
  });
}

// POST /api/admin/logout
function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out' });
  });
}

// GET /api/admin/session
function getSession(req, res) {
  if (req.session?.isAdmin) {
    return res.json({
      success: true,
      data: { authenticated: true, username: req.session.adminUsername || null },
    });
  }
  return res.status(401).json({ success: false, data: { authenticated: false } });
}

// Middleware: protect admin routes using server-side session.
function requireAdmin(req, res, next) {
  if (!req.session?.isAdmin) {
    return res.status(401).json({ success: false, message: 'Unauthorised' });
  }
  next();
}

module.exports = { login, logout, getSession, requireAdmin };
