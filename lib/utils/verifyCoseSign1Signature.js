var CSL = require('@emurgo/cardano-serialization-lib-nodejs');
var MSG = require('@emurgo/cardano-message-signing-nodejs');

/**
 * Check if the signature matchs with the public key
 * @param {String} key
 * @param {String} signature
 * @returns
 */
var verifyCoseSign1Signature = function (key, signature) {
  var coseSignature = MSG.COSESign1.from_bytes(Buffer.from(signature, 'hex'));

  var coseKey = MSG.COSEKey.from_bytes(Buffer.from(key, 'hex'));

  var bKey = coseKey
    .header(MSG.Label.new_int(MSG.Int.new_negative(MSG.BigNum.from_str('2'))))
    .as_bytes();

  var publicKey = CSL.PublicKey.from_bytes(bKey);

  var signedPayload = coseSignature.signed_data().to_bytes();

  var ed25519Signature = CSL.Ed25519Signature.from_bytes(
    coseSignature.signature()
  );

  return publicKey.verify(signedPayload, ed25519Signature);
};

module.exports = verifyCoseSign1Signature;
