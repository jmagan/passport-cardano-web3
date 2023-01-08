var CSL = require('@emurgo/cardano-serialization-lib-nodejs');
var MSG = require('@emurgo/cardano-message-signing-nodejs');

/**
 * Get the bech32 address from a COSE_Sign1 signature
 * @param {String} signature - Hex string represeantation of a COSE_Sign1 signature
 */
var getCoseSign1Bech32Address = function (signature){
  var coseSignature = MSG.COSESign1.from_bytes(Buffer.from(signature, 'hex'));

  var bAddress = coseSignature
    .headers()
    .protected()
    .deserialized_headers()
    .header(MSG.Label.new_text('address'))
    .as_bytes();

  var address = CSL.Address.from_bytes(bAddress);

  return address.to_bech32();
};

module.exports = getCoseSign1Bech32Address;
