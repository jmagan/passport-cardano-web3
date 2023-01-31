var getPayload  = require('./utils').getPayload;
var checkExpiration = require('./utils').checkExpiration;
var verifyCoseSign1Signature = require('./utils').verifyCoseSign1Signature;
var getCoseSign1Bech32Address = require('./utils').getCoseSign1Bech32Address;
var verifyCoseSign1Address = require('./utils').verifyCoseSign1Address;

/**
 * `Strategy` constructor.
 *
 * @param {Object} options Strategy options.
 * @api public
 */
function Strategy(options) {
  if (!options) {
    throw new TypeError('CardanoWeb3Strategy requires an options object');
  }

  if (!options.expirationTimeSpan) {
    throw new TypeError('CardanoWeb3Strategy requires a expiration time span');
  }

  if (!options.hostname) {
    throw new TypeError('CardanoWeb3Strategy requires the hostname');
  }

  this.name = 'cardano-web3';
  this._expirationTimeSpan = options.expirationTimeSpan;
  this._hostname = options.hostname;
}

/**
 * Authenticate request based on the contents of a form submission.
 * @param {Object} req HTTP request object.
 * @api protected
 */
Strategy.prototype.authenticate = function (req, options) {
  var self = this;

  if (!req.body || !req.body.key || !req.body.signature) {
    return self.error(
      new Error('Key and/or signature are not present in the request body')
    );
  }

  if (!options || !options.action){
    return self.error(new Error('Action option is mandatory'));
  }

  var key = req.body.key;
  var signature = req.body.signature;

  try {
    var payload = getPayload(signature);

    if (
      !checkExpiration(
        payload,
        options && options.expirationTimeSpan
          ? options.expirationTimeSpan
          : self._expirationTimeSpan
      )
    ) {
      return self.fail('Expired timestamp', 401);
    }

    if (payload.action !== options.action) {
      return self.fail('Invalid action', 401);
    }

    if (self._hostname + req.url !== payload.url) {
      return self.fail('Invalid url', 401);
    }

    if (!verifyCoseSign1Signature(key, signature)) {
      return self.fail('Invalid signature', 401);
    }

    var addressBech32 = getCoseSign1Bech32Address(signature);

    if (!verifyCoseSign1Address(key, signature, addressBech32)) {
      return self.fail('Public key doesn\'t match the provided address', 401);
    }

    return self.success(
      { provider: 'cardano-web3', id: addressBech32 },
      payload
    );
  } catch (ex) {
    if (typeof ex === 'string' || ex instanceof String) {
      return self.error(new Error(ex));
    } else {
      return self.error(ex);
    }
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
