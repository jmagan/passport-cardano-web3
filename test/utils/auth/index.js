var createFakePrivateKey = require('./createFakePrivateKey.js').createFakePrivateKey;
var createRewardAddress = require('./createRewardAddress').createRewardAddress;
var createCOSEKey = require('./createCOSEKey.js').createCOSEKey;
var createCOSESign1Signature = require('./createCOSESign1Signature.js').createCOSESign1Signature;

module.exports = {
  createFakePrivateKey: createFakePrivateKey,
  createRewardAddress: createRewardAddress,
  createCOSEKey: createCOSEKey,
  createCOSESign1Signature: createCOSESign1Signature,
};
