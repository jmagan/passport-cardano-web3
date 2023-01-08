# passport-cardano-web3

[![Node.js CI](https://github.com/jmagan/passport-cardano-web3/actions/workflows/node.js.yml/badge.svg)](https://github.com/jmagan/passport-cardano-web3/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/jmagan/passport-cardano-web3/badge.svg?branch=main)](https://coveralls.io/github/jmagan/passport-cardano-web3?branch=main)

[Passport](http://passportjs.org/) strategy for authenticating with Cardano wallet signatures.

This module lets you authenticate using a Cardano wallet in your Node.js applications. 
## Install

    $ npm install passport-cardano-web3

## Usage

### Configure Strategy

The Cardano web3 strategy needs two parameters. The ```expirationTimeSpan``` is an mandatory parameter which represents the number of seconds for the payload experiation. The ```hostname``` is also mandatory and it is used to validate the endpoint url.

```javascript
const passport = require('passport')
const CardanoWeb3Strategy = require('passport-cardano-web3').Strategy

const cardanoWeb3Strategy = new CardanoWeb3Strategy({
  expirationTimeSpan: 30,
  hostname: 'https://example.com'
})

passport.use(cardanoWeb3Strategy)
```
### Authenticate Requests

Each route can be configured to use this strategy. In order to attach this strategy to an endpoint, we need to configure the ```action``` option with a descriptive text about the goal of the endpoint. This action text will be shown to the user for validation. This is an example in the server side:

```javascript
const passport = require('passport')

/*
 * Login route
 */
router.post(
  '/login',
  passport.authenticate('cardano-web3', { action: 'Login', session: false })
)
```
In the client side, we will use the ```api.signData(addr: Address, payload: Bytes): Promise<DataSignature>``` defined in [Cardano dApp-Wallet Web Bridge CIP-0030](/CIP-0030/README.md) to get the key and signature:

```javascript
const payload = {
        url: 'https://example.com/login',
        action: 'Login',
        timestamp: Date.now(),
      };

const signature = await cardano.signData(
address,
Buffer.from(JSON.stringify(payload)).toString('hex'),
);

const response = await fetch.post('/login', {
key: signature.key,
signature: signature.signature,
}); 
```
This strategy must not be used with GET requests. It's dangerous to send the wallet public key and signature in the query params. The request body must have the ```key``` and ```signature``` obtained from the ```singData``` method.

This strategy can be combined with other Passport strategies, like ``passport-session`` or ```passport-jwt```.

## Example

The repository [jmagan/cardano-express-web3-skeleton](https://github.com/jmagan/cardano-express-web3-skeleton) contains a complete implementation of this strategy combined with a jwt strategy. It uses the Cardano Web3 strategy to validate the login, register and reset endpoints and afterwards a jwt token is issued taking the responsability for the authenticated requests.
## Tests

    $ npm install
    $ npm test

## License

[The MIT License](http://opensource.org/licenses/MIT)
