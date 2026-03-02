const { Op } = require('sequelize');
const { User } = require('../models');
const { verifyPassword } = require('../utils/password');

// POST /api/admin/login
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  try {
    let user = await User.findOne({
      where: {
        role: 'admin',
        active: true,
        [Op.or]: [{ username }, { email: username }],
      },
    });

    const isValid = !!user && verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    await user.update({ lastLoginAt: new Date() });

    return req.session.regenerate(err => {
      if (err) return res.status(500).json({ success: false, message: 'Failed to start session' });

      req.session.isAdmin = true;
      req.session.adminUserId = user.id;
      req.session.adminUsername = user.username || user.email || username;
      req.session.save(saveErr => {
        if (saveErr) {
          return res.status(500).json({ success: false, message: 'Failed to persist session' });
        }
        return res.json({ success: true });
      });
    });
  } catch (err) {
    console.error('[adminAuth.login] error:', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
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
