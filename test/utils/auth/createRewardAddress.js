var CSL = require('@emurgo/cardano-serialization-lib-nodejs');

/**
 *
 * @param {CSL.PrivateKey} privateKey
 * @param {CSL.NetworkId} networkId
 * @returns
 */
var createRewardAddress = function (
  privateKey,
  networkId
) {

  var networkId = networkId ? networkId : CSL.NetworkId.mainnet();
  return CSL.RewardAddress.new(
    networkId.kind(),
    CSL.StakeCredential.from_keyhash(privateKey.to_public().hash())
  );
};

module.exports = { createRewardAddress: createRewardAddress };
