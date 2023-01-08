/* eslint-disable no-unused-vars */
/* global describe, it, expect */

var Strategy = require('../lib/strategy');

describe('Strategy', function () {

	var strategy = new Strategy({ expirationTimeSpan: 30, hostname: 'https://example.com' });

	it('should be named cardano-web3', function () {
		expect(strategy.name).to.equal('cardano-web3');
	});

	it('should throw if constructed without an options object', function () {
		expect(function () {
			var s = new Strategy();
		}).to.throw(TypeError, 'CardanoWeb3Strategy requires an options object');
	});

	it('should throw if constructed without a expiration time span', function () {
		expect(function () {
			var s = new Strategy({});
		}).to.throw(TypeError, 'CardanoWeb3Strategy requires a expiration time span');
	});

	it('should throw if constructed without a hostname', function () {
		expect(function () {
			var s = new Strategy({ expirationTimeSpan: 30});
		}).to.throw(TypeError, 'CardanoWeb3Strategy requires the hostname');
	});

});
