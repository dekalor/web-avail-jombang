// server/middleware/errorHandler.js

function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

function errorHandler(err, req, res, next) {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Try a smaller image or raise BODY_LIMIT.',
    });
  }

  // Services throw errors with a .status property for known errors
  const statusCode = err.status || err.statusCode || 500;
  if (statusCode === 500) console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { notFound, errorHandler };
