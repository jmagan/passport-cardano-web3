var MSG = require('@emurgo/cardano-message-signing-nodejs');

/**
 *
 * @param {Object} payload
 * @param {CSL.RewardAddress} address
 * @param {CSL.PrivateKey} privateKey
 * @returns
 */
var createCOSESign1Signature = function (payload, address, privateKey) {
  var protectedHeaders = MSG.HeaderMap.new();
  protectedHeaders.set_header(
    MSG.Label.new_text('address'),
    MSG.CBORValue.new_bytes(address.to_address().to_bytes())
  );
  var protectedHeadersSerialized =
    MSG.ProtectedHeaderMap.new(protectedHeaders);
  var headers = MSG.Headers.new(
    protectedHeadersSerialized,
    MSG.HeaderMap.new()
  );
  var builder = MSG.COSESign1Builder.new(
    headers,
    Buffer.from(JSON.stringify(payload)),
    false
  );
  var toSign = builder.make_data_to_sign().to_bytes();
  var signedSignature = privateKey.sign(toSign).to_bytes();

  return builder.build(signedSignature);
};

module.exports = { createCOSESign1Signature: createCOSESign1Signature };
