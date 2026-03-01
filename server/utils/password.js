const crypto = require('crypto');

const SCRYPT_KEYLEN = 64;

function hashPassword(plainTextPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto
    .scryptSync(String(plainTextPassword), salt, SCRYPT_KEYLEN)
    .toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

function verifyPassword(plainTextPassword, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;

  const [algorithm, salt, hashedKey] = storedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !hashedKey) return false;

  const derivedKey = crypto
    .scryptSync(String(plainTextPassword), salt, SCRYPT_KEYLEN)
    .toString('hex');

  const hashedKeyBuffer = Buffer.from(hashedKey, 'hex');
  const derivedKeyBuffer = Buffer.from(derivedKey, 'hex');
  if (hashedKeyBuffer.length !== derivedKeyBuffer.length) return false;

  return crypto.timingSafeEqual(hashedKeyBuffer, derivedKeyBuffer);
}

module.exports = { hashPassword, verifyPassword };

