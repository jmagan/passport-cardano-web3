/* global describe, it, expect */

var chai = require('chai'),
  Strategy = require('../lib/strategy');
var createFakePrivateKey = require('./utils/auth').createFakePrivateKey;
var createRewardAddress = require('./utils/auth').createRewardAddress;
var createCOSEKey = require('./utils/auth').createCOSEKey;
var createCOSESign1Signature = require('./utils/auth').createCOSESign1Signature;

describe('Strategy error', function () {
  describe('encountering an error during verification', function () {
    it('should throw error when key or/and signature is not present', function (done) {
      chai.passport
        .use(
          new Strategy({
            expirationTimeSpan: 10,
            hostname: 'https://example.com',
          })
        )
        .request(function (req) {
          req.body = { key: 'INVALIDKEY' };
        })
        .error(function (err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.equal(
            'Key and/or signature are not present in the request body'
          );
          done();
        })
        .authenticate({ action: 'Test' });
    });

    it('should throw error when signature is not valid', function (done) {
      chai.passport
        .use(
          new Strategy({
            expirationTimeSpan: 10,
            hostname: 'https://example.com',
          })
        )
        .request(function (req) {
          req.body = { key: 'INVALIDKEY', signature: 'INVALIDSIGNATURE' };
        })
        .error(function (err) {
          expect(err).to.be.an.instanceof(Error);
          expect(
            err.message.startsWith('Deserialization failed in COSESign1')
          ).to.be.true;
          done();
        })
        .authenticate({ action: 'Test' });
    });

    it('should throw error when timestamp is not valid', function (done) {
      var privateKey = createFakePrivateKey(1);
      var address = createRewardAddress(privateKey);

      var key = createCOSEKey(privateKey);
      var signature = createCOSESign1Signature({}, address, privateKey);

      chai.passport
        .use(
          new Strategy({
            expirationTimeSpan: 10,
            hostname: 'https://example.com',
          })
        )
        .request(function (req) {
          req.body = {};
          req.body.key = Buffer.from(key.to_bytes()).toString('hex');
          req.body.signature = Buffer.from(signature.to_bytes()).toString(
            'hex'
          );
        })
        .error(function (err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.be.equals('Invalid or missing timestamp');
          done();
        })
        .authenticate({ action: 'Test' });
    });

    it('should throw error when action option is not present', function (done) {
      var privateKey = createFakePrivateKey(1);
      var address = createRewardAddress(privateKey);

      var key = createCOSEKey(privateKey);
      var signature = createCOSESign1Signature({}, address, privateKey);

      chai.passport
        .use(
          new Strategy({
            expirationTimeSpan: 10,
            hostname: 'https://example.com',
          })
        )
        .request(function (req) {
          req.body = {};
          req.body.key = Buffer.from(key.to_bytes()).toString('hex');
          req.body.signature = Buffer.from(signature.to_bytes()).toString(
            'hex'
          );
        })
        .error(function (err) {
          expect(err).to.be.an.instanceof(Error);
          expect(err.message).to.be.equals('Action option is mandatory');
          done();
        })
        .authenticate();
    });
  });
});
