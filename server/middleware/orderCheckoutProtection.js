const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { API_SECURITY } = require('../config/config');

const challengeStore = new Map();

function cleanupExpiredChallenges() {
  const now = Date.now();
  for (const [id, value] of challengeStore.entries()) {
    if (value.expiresAt <= now) {
      challengeStore.delete(id);
    }
  }
}

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

function issueCheckoutProtection(req, res) {
  cleanupExpiredChallenges();

  const guestToken = ensureGuestToken(req);
  const challengeId = crypto.randomUUID();
  const now = Date.now();

  challengeStore.set(challengeId, {
    issuedAt: now,
    expiresAt: now + API_SECURITY.CHECKOUT_CHALLENGE_TTL_MS,
    guestToken,
    ip: getClientIp(req),
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

function verifyCheckoutProtection(req, res, next) {
  cleanupExpiredChallenges();

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

  const challenge = challengeStore.get(challengeId);
  if (!challenge) {
    return res.status(403).json({
      success: false,
      message: 'Challenge is invalid or expired',
    });
  }

  if (challenge.guestToken !== guestToken || challenge.ip !== getClientIp(req)) {
    challengeStore.delete(challengeId);
    return res.status(403).json({
      success: false,
      message: 'Challenge does not match this request',
    });
  }

  const elapsed = Date.now() - challenge.issuedAt;
  if (elapsed < API_SECURITY.CHECKOUT_CHALLENGE_MIN_SUBMIT_MS) {
    return res.status(429).json({
      success: false,
      message: 'Request looks automated. Please wait a moment and try again.',
    });
  }

  challengeStore.delete(challengeId);
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
