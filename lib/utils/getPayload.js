var MSG = require('@emurgo/cardano-message-signing-nodejs');

/**
 *
 * @param {String} signature
 */
var getPayload = function (signature) {
  var coseSign1 = MSG.COSESign1.from_bytes(Buffer.from(signature, 'hex'));
  var payload = JSON.parse(Buffer.from(coseSign1.payload()).toString());

  return payload;
};

module.exports = getPayload;
