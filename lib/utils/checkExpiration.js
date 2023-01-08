/**
 *
 * @param {Object} payload
 * @param {Number} expirationTimeSpan
 * @returns
 */
var checkExpiration = function (payload, expirationTimeSpan) {
  if (!payload.timestamp || !Number.isInteger(payload.timestamp)) {
    throw Error('Invalid or missing timestamp');
  }

  if (
    payload.timestamp > Date.now() ||
    payload.timestamp < Date.now() - expirationTimeSpan * 1000
  ) {
    return false;
  }

  return true;
};

module.exports = checkExpiration;
