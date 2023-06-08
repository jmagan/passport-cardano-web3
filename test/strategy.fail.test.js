/* global describe, it */
/* jshint expr: true */

var chai = require('chai');
var Strategy = require('../lib/strategy');

var createFakePrivateKey = require('./utils/auth').createFakePrivateKey;
var createRewardAddress = require('./utils/auth').createRewardAddress;
var createCOSEKey = require('./utils/auth').createCOSEKey;
var createCOSESign1Signature = require('./utils/auth').createCOSESign1Signature;
var expect = require('chai').expect;

describe('Strategy fail', function () {
  it('should NOT validate if the payload is expired', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);

    var key = createCOSEKey(privateKey);
    var signature = createCOSESign1Signature(
      {
        action: 'dummy action',
        uri: 'dummy uri',
        timestamp: Date.now() - 10 * 1000 - 1,
      },
      address,
      privateKey
    );

    chai.passport
      .use(strategy)
      .request(function (req) {
        req.body = {};
        req.body.key = Buffer.from(key.to_bytes()).toString('hex');
        req.body.signature = Buffer.from(signature.to_bytes()).toString('hex');
      })
      .fail(function (challenge, status) {
        expect(challenge).to.be.equals('Expired timestamp');
        expect(status).to.be.equals(401);
        done();
      })
      .authenticate({ action: 'Test' });
  });

  it('should NOT validate if the action doesn\'t match', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);

    var key = createCOSEKey(privateKey);
    var signature = createCOSESign1Signature(
      {
        timestamp: Date.now(),
        uri: 'https://example2.com/profile',
        action: 'Test2',
      },
      address,
      privateKey
    );

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
      .fail(function (challenge, status) {
        expect(challenge).to.be.equals('Invalid action');
        expect(status).to.be.equals(401);
        done();
      })
      .authenticate({ action: 'Test' });
  });

  it('should NOT validate if the url doesn\'t match', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);

    var key = createCOSEKey(privateKey);
    var signature = createCOSESign1Signature(
      {
        timestamp: Date.now(),
        uri: 'https://example2.com/profile',
        action: 'Test',
      },
      address,
      privateKey
    );

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
      .fail(function (challenge, status) {
        expect(challenge).to.be.equals('Invalid uri');
        expect(status).to.be.equals(401);
        done();
      })
      .authenticate({ action: 'Test' });
  });

  it('should NOT validate if the signature is invalid', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var address = createRewardAddress(privateKey);
    var invalidPrivateKey = createFakePrivateKey(2);

    var key = createCOSEKey(invalidPrivateKey);
    var signature = createCOSESign1Signature(
      {
        timestamp: Date.now(),
        uri: 'https://example.com/users/profile',
        action: 'Test',
      },
      address,
      privateKey
    );

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
      .fail(function (challenge, status) {
        expect(challenge).to.be.equals('Invalid signature');
        expect(status).to.be.equals(401);
        done();
      })
      .authenticate({ action: 'Test' });
  });

  it('should NOT validate if the address doesn\'t match with the public key', function (done) {
    var strategy = new Strategy({
      expirationTimeSpan: 10,
      hostname: 'https://example.com',
    });

    var privateKey = createFakePrivateKey(1);
    var otherPrivateKey = createFakePrivateKey(2);
    var otherAddress = createRewardAddress(otherPrivateKey);

    var key = createCOSEKey(privateKey);
    var signature = createCOSESign1Signature(
      {
        timestamp: Date.now(),
        uri: 'https://example.com/users/profile',
        action: 'Test',
      },
      otherAddress,
      privateKey
    );

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
      .fail(function (challenge, status) {
        expect(challenge).to.be.equals(
          'Public key doesn\'t match the provided address'
        );
        expect(status).to.be.equals(401);
        done();
      })
      .authenticate({ action: 'Test' });
  });
});
