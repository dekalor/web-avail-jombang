const crypto = require('crypto');
const { Op } = require('sequelize');
const rateLimit = require('express-rate-limit');
const { API_SECURITY } = require('../config/config');

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function ensureGuestToken(req) {
  if (!req.session.guestCheckoutToken) {
    req.session.guestCheckoutToken = crypto.randomBytes(24).toString('hex');
  }
  return req.session.guestCheckoutToken;
}

async function issueCheckoutProtection(req, res) {
  // Lazy cleanup of expired challenges
  const { CheckoutChallenge } = require('../models');
  CheckoutChallenge.destroy({ where: { expiresAt: { [Op.lt]: Date.now() } } }).catch(() => {});

  const guestToken = ensureGuestToken(req);
  const challengeId = crypto.randomUUID();
  const now = Date.now();

  await CheckoutChallenge.create({
    id: challengeId,
    guestToken,
    ip: getClientIp(req),
    issuedAt: now,
    expiresAt: now + API_SECURITY.CHECKOUT_CHALLENGE_TTL_MS,
  });

  return res.json({
    success: true,
    data: {
      guest_checkout_token: guestToken,
      challenge_id: challengeId,
      min_submit_ms: API_SECURITY.CHECKOUT_CHALLENGE_MIN_SUBMIT_MS,
      expires_in_ms: API_SECURITY.CHECKOUT_CHALLENGE_TTL_MS,
    },
  });
}

async function verifyCheckoutProtection(req, res, next) {
  const { CheckoutChallenge } = require('../models');

  const data = req.validated || req.body || {};
  const guestToken = data.guest_checkout_token;
  const challengeId = data.challenge_id;

  if (!guestToken || !challengeId) {
    return res.status(403).json({
      success: false,
      message: 'Checkout protection token is required',
    });
  }

  const sessionGuestToken = req.session?.guestCheckoutToken;
  if (!sessionGuestToken || sessionGuestToken !== guestToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid guest checkout token',
    });
  }

  const challenge = await CheckoutChallenge.findByPk(challengeId);
  if (!challenge) {
    return res.status(403).json({
      success: false,
      message: 'Challenge is invalid or expired',
    });
  }

  const now = Date.now();

  if (Number(challenge.expiresAt) <= now) {
    await challenge.destroy();
    return res.status(403).json({
      success: false,
      message: 'Challenge is invalid or expired',
    });
  }

  if (challenge.guestToken !== guestToken || challenge.ip !== getClientIp(req)) {
    await challenge.destroy();
    return res.status(403).json({
      success: false,
      message: 'Challenge does not match this request',
    });
  }

  const elapsed = now - Number(challenge.issuedAt);
  if (elapsed < API_SECURITY.CHECKOUT_CHALLENGE_MIN_SUBMIT_MS) {
    return res.status(429).json({
      success: false,
      message: 'Request looks automated. Please wait a moment and try again.',
    });
  }

  await challenge.destroy();
  return next();
}

const orderCreateRateLimiter = rateLimit({
  windowMs: API_SECURITY.ORDER_CREATE_RATE_LIMIT_WINDOW_MS,
  max: API_SECURITY.ORDER_CREATE_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getClientIp(req),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Terlalu banyak pesanan, mohon coba lagi nanti',
    });
  },
});

module.exports = {
  issueCheckoutProtection,
  verifyCheckoutProtection,
  orderCreateRateLimiter,
};
