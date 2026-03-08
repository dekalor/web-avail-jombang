const { v2: cloudinary } = require('cloudinary');

const IMAGE_MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const VIDEO_MIME_TO_EXT = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
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

function parseMediaDataUrl(dataUrl) {
  if (typeof dataUrl !== 'string') {
    throw new Error('Invalid media payload');
  }

  const match = dataUrl.match(/^data:((image|video)\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Media must be a valid base64 data URL');
  }

  const mimeType = match[1].toLowerCase();
  const mediaGroup = match[2].toLowerCase();
  const base64 = match[3];
  const mimeMap = mediaGroup === 'video' ? VIDEO_MIME_TO_EXT : IMAGE_MIME_TO_EXT;
  const ext = mimeMap[mimeType];

  if (!ext) {
    if (mediaGroup === 'video') {
      throw new Error('Unsupported video type. Use MP4, WEBM, or MOV');
    }
    throw new Error('Unsupported image type. Use JPG, PNG, WEBP, or GIF');
  }

  return { mimeType, base64, ext, mediaType: mediaGroup };
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

async function uploadMediaDataUrl(dataUrl, { folder, prefix }) {
  loadConfig();

  const { base64, ext, mediaType } = parseMediaDataUrl(dataUrl);
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.length === 0) {
    throw new Error('Media payload is empty');
  }

  const maxSizeBytes = mediaType === 'video'
    ? 20 * 1024 * 1024
    : 5 * 1024 * 1024;

  if (buffer.length > maxSizeBytes) {
    if (mediaType === 'video') {
      throw new Error('Video is too large (max 20MB)');
    }
    throw new Error('Image is too large (max 5MB)');
  }

  const publicId = `${prefix}-${Date.now()}-${randomSuffix()}`;
  const result = await cloudinary.uploader.upload(dataUrl, {
    asset_folder: folder,
    use_asset_folder_as_public_id_prefix: true,
    public_id: publicId,
    resource_type: 'auto',
    overwrite: false,
    format: ext,
  });

  return {
    url: result.secure_url,
    mediaType,
  };
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
  const result = await uploadMediaDataUrl(dataUrl, { folder, prefix: 'product' });
  if (result.mediaType !== 'image') {
    throw new Error('Product image must be an image file');
  }
  return result.url;
}

async function storeProductDetailMedia(dataUrl) {
  const folder = process.env.CLOUDINARY_PRODUCT_DETAILS_FOLDER || process.env.CLOUDINARY_PRODUCTS_FOLDER;
  return uploadMediaDataUrl(dataUrl, { folder, prefix: 'product-detail' });
}

async function storeOrderPaymentProof(dataUrl) {
  const folder = process.env.CLOUDINARY_ORDERS_FOLDER;
  const result = await uploadMediaDataUrl(dataUrl, { folder, prefix: 'payment-proof' });
  if (result.mediaType !== 'image') {
    throw new Error('Payment proof must be an image file');
  }
  return result.url;
}

async function deleteUploadedAsset(assetUrl) {
  if (!assetUrl || typeof assetUrl !== 'string') return;

  const publicId = parseCloudinaryPublicId(assetUrl);
  if (!publicId) return;

  loadConfig();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true });
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video', invalidate: true });
}

module.exports = {
  storeProductImage,
  storeProductDetailMedia,
  storeOrderPaymentProof,
  deleteUploadedAsset,
  deleteUploadedImage: deleteUploadedAsset,
};
