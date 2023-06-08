/* global describe, it */
/* jshint expr: true */

var chai = require('chai');
var Strategy = require('../lib/strategy');
var createFakePrivateKey = require('./utils/auth').createFakePrivateKey;
var createRewardAddress = require('./utils/auth').createRewardAddress;
var createCOSEKey = require('./utils/auth').createCOSEKey;
var createCOSESign1Signature = require('./utils/auth').createCOSESign1Signature;

var expect = require('chai').expect;

describe('Strategy success', function () {
  it('should validate', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);

    var key = createCOSEKey(privateKey);
    var payload = {
      timestamp: Date.now(),
      uri: 'https://example.com/users/profile',
      action: 'Test'
    };
    var signature = createCOSESign1Signature(payload, address, privateKey);

    chai.passport
      .use(strategy)
      .request(function (req) {
        req.url = '/users/profile';
        req.baseUrl = '/users';
        req.path = '/profile';
        req.body = {};
        req.body.key = Buffer.from(key.to_bytes()).toString('hex');
        req.body.signature = Buffer.from(signature.to_bytes()).toString('hex');
      })
      .success(function (user, info) {
        expect(user).to.be.instanceOf(Object);
        expect(user.id).to.be.equals(address.to_address().to_bech32());
        expect(user.provider).to.be.equals('cardano-web3');
        expect(info).to.be.instanceOf(Object);
        expect(info).to.be.deep.equal(payload);
        done();
      })
      .authenticate({action: 'Test'});
  });

  it('should validate overriding expiration timespan', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);

    var key = createCOSEKey(privateKey);
    var payload = {
      timestamp: Date.now(),
      uri: 'https://example.com/users/profile',
      action: 'Test'
    };
    var signature = createCOSESign1Signature(payload, address, privateKey);

    chai.passport
      .use(strategy)
      .request(function (req) {
        req.body = {};
        req.url = '/users/profile';
        req.baseUrl = '/users';
        req.path = '/profile';
        req.body.key = Buffer.from(key.to_bytes()).toString('hex');
        req.body.signature = Buffer.from(signature.to_bytes()).toString('hex');
      })
      .success(function (user, info) {
        expect(user).to.be.instanceOf(Object);
        expect(user.id).to.be.equals(address.to_address().to_bech32());
        expect(user.provider).to.be.equals('cardano-web3');
        expect(info).to.be.instanceOf(Object);
        expect(info).to.be.deep.equal(payload);
        done();
      })
      .authenticate({ expirationTimeSpan: 20, action: 'Test' });
  });
});
