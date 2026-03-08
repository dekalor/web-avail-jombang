const { v2: cloudinary } = require('cloudinary');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

function loadConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary config is missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

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

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

async function uploadImageDataUrl(dataUrl, { folder, prefix }) {
  loadConfig();

  const { base64, ext } = parseDataUrl(dataUrl);
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0) {
    throw new Error('Image payload is empty');
  }
  if (buffer.length > 5 * 1024 * 1024) {
    throw new Error('Image is too large (max 5MB)');
  }

  const publicId = `${prefix}-${Date.now()}-${randomSuffix()}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    asset_folder: folder,
    use_asset_folder_as_public_id_prefix: true,
    public_id: publicId,
    resource_type: 'image',
    overwrite: false,
    format: ext,
  });

  return result.secure_url;
}

function parseCloudinaryPublicId(url) {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split('/').filter(Boolean);
    const uploadIdx = segments.findIndex((segment) => segment === 'upload');
    if (uploadIdx === -1) return null;

    let startIdx = uploadIdx + 1;
    if (segments[startIdx] && /^v\d+$/.test(segments[startIdx])) {
      startIdx += 1;
    }

    const publicIdWithExt = segments.slice(startIdx).join('/');
    if (!publicIdWithExt) return null;
    return publicIdWithExt.replace(/\.[^.]+$/, '');
  } catch (_) {
    return null;
  }
}

async function storeProductImage(dataUrl) {
  const folder = process.env.CLOUDINARY_PRODUCTS_FOLDER;
  return uploadImageDataUrl(dataUrl, { folder, prefix: 'product' });
}

async function storeOrderPaymentProof(dataUrl) {
  const folder = process.env.CLOUDINARY_ORDERS_FOLDER;
  return uploadImageDataUrl(dataUrl, { folder, prefix: 'payment-proof' });
}

async function deleteUploadedImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string') return;

  const publicId = parseCloudinaryPublicId(imageUrl);
  if (!publicId) return;

  loadConfig();
  await cloudinary.uploader.destroy(publicId, {
    resource_type: 'image',
    invalidate: true,
  });
}

module.exports = {
  storeProductImage,
  storeOrderPaymentProof,
  deleteUploadedImage,
};
