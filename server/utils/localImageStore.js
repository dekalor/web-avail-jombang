const fs = require('fs/promises');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads', 'products');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') {
    throw new Error('Invalid image payload');
  }

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Image must be a valid base64 data URL');
  }

  const mimeType = match[1].toLowerCase();
  const base64 = match[2];
  const ext = MIME_TO_EXT[mimeType];

  if (!ext) {
    throw new Error('Unsupported image type. Use JPG, PNG, WEBP, or GIF');
  }

  return { mimeType, base64, ext };
}

async function storeProductImage(dataUrl) {
  const { base64, ext } = parseDataUrl(dataUrl);
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0) {
    throw new Error('Image payload is empty');
  }
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error('Image is too large (max 5MB)');
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const fileName = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const absPath = path.join(UPLOADS_DIR, fileName);

  await fs.writeFile(absPath, buffer);
  return `/uploads/products/${fileName}`;
}

async function deleteLocalImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;
  if (!imageUrl.startsWith('/uploads/products/')) return;

  const absPath = path.join(ROOT_DIR, imageUrl.replace(/^\/+/, ''));
  try {
    await fs.unlink(absPath);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

module.exports = {
  storeProductImage,
  deleteLocalImage,
};
