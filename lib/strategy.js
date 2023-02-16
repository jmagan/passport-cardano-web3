var Web3Authentication = require('cardano-web3-utils').Web3Authentication;



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
  this._web3Authentication = new Web3Authentication(
    options.expirationTimeSpan,
    options.hostname
  );
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

  if (!options || !options.action) {
    return self.error(new Error('Action option is mandatory'));
  }

  var key = req.body.key;
  var signature = req.body.signature;

  try {
    var web3Auth = self._web3Authentication.authenticate(
      req.url,
      options.action,
      key,
      signature,
      options
    );

    return self.success(
      { provider: 'cardano-web3', id: web3Auth.walletAddress },
      web3Auth.payload
    );
  } catch (ex) {
    if (ex instanceof Error && ex.name === 'Web3AuthenticationError') {
      self.fail(ex.message, ex.httpErrorCode);
    } else if (typeof ex === 'string' || ex instanceof String) {
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
