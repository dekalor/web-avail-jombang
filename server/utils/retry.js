function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  if (!error.response) return true; // network error

  const status = error.response.status;
  return status >= 500 || status === 429;
}

/**
 * Retry async function
 * @param {Function} fn async function to retry
 * @param {number} retries total retries
 * @param {Function} delayFn function to product delay with exponential backoff
 */
async function retry(fn, retries = 3, delayFn = () => 1000) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();

    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        throw error;
      }
      console.warn(`Retry attempt ${attempt}`);

      if (attempt < retries) {
        const delay = delayFn(attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

module.exports = retry;