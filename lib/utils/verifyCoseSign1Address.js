var CSL = require('@emurgo/cardano-serialization-lib-nodejs');
var MSG = require('@emurgo/cardano-message-signing-nodejs');

var verifyCoseSign1Address = function (key, signature, bech32Address) {
  var coseSignature = MSG.COSESign1.from_bytes(Buffer.from(signature, 'hex'));

  var coseKey = MSG.COSEKey.from_bytes(Buffer.from(key, 'hex'));

  var bKey = coseKey
    .header(MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str('2'))))
    .as_bytes();

  var publicKey = CSL.PublicKey.from_bytes(bKey);

  var bAddress = coseSignature
    .headers()
    .protected()
    .deserialized_headers()
    .header(MSG.Label.new_text('address'))
    .as_bytes();

  var address = CSL.RewardAddress.from_address(
    CSL.Address.from_bytes(bAddress)
  );

  var signatureKeyHash = address.payment_cred().to_keyhash().to_hex();
  var publicKeyHash = publicKey.hash().to_hex();

  return (
    signatureKeyHash === publicKeyHash &&
    address.to_address().to_bech32() === bech32Address
  );
};

module.exports = verifyCoseSign1Address;
