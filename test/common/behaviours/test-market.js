
const should = require('should');
const market = require('../../../lib/common/behaviours/market');


describe('Market', function () {

	it('executes overlapping buy and sell orders', function () {

		const res = market.executeMarketOrders(Object.assign(market.createMarket(), {
			orderBook: {
				bids: [
					{ price: 10, volume: 10 }
				],
				asks: [
					{ price: 10, volume: 10 }
				]
			}
		}));

		res.market.volume.should.equal(10);
		res.market.avgPrice.should.equal(10);
		res.trades.length.should.equal(1);

	});

	it("doesn't execute non-overlapping orders", function () {
		const initialMarket = market.createMarket();
		const res = market.executeMarketOrders(Object.assign(initialMarket, {
			orderBook: {
				bids: [
					{ price: 10, volume: 10 }
				],
				asks: [
					{ price: 10.1, volume: 10 }
				]
			}
		}));

		res.market.volume.should.equal(0);
		res.market.avgPrice.should.equal(initialMarket.avgPrice);
		res.trades.length.should.equal(0);

	});

})
