
const should = require('should');
const stockpile = require('../../../lib/common/behaviours/stockpile');


describe('Natural Resource', function () {

	it('initally has zero quantity', function () {
		const sp = stockpile.initialState;
		stockpile.qty('stockpile-a', 'gold', sp).should.eql(0);
	});


	it('can be given resources', function () {
		const action = stockpile.giveToStockpile(
			'stockpile-a', 'gold', 10
		);
		const sp = stockpile.stockpileReducer(
			stockpile.initialState,
			action
		);

		stockpile.qty('stockpile-a', 'gold', sp).should.eql(10);
		stockpile.qty('stockpile-a', 'silver', sp).should.eql(0);
	});

	it('can have resources taken from it', function () {
		const sp = [
			stockpile.giveToStockpile(
				'stockpile-a', 'gold', 10
			),
			stockpile.takeFromStockpile(
				'stockpile-a', 'gold', 5
			)
		].reduce(stockpile.stockpileReducer, stockpile.initialState);

		stockpile.qty('stockpile-a', 'gold', sp).should.eql(5);
	});

	it("can't take from stockpile with insufficient stock", function () {
		const initialState = stockpile.stockpileReducer(
			stockpile.initialState,
			stockpile.giveToStockpile(
				'stockpile-a', 'gold', 10
			)
		);

		const state = stockpile.stockpileReducer(
			initialState,
			stockpile.takeFromStockpile(
				'stockpile-a', 'gold', 10.1
			)
		);

		stockpile.qty('stockpile-a', 'gold', state).should.eql(10);
		state.should.equal(initialState);
	});

	it('can transfer resources to another stockpile', function () {
		const sp = [
			stockpile.giveToStockpile(
				'stockpile-a', 'gold', 10
			),
			stockpile.transferBetweenStockpiles(
				'stockpile-a', 'stockpile-b', 'gold', 9
			)
		].reduce(stockpile.stockpileReducer, stockpile.initialState);

		stockpile.qty('stockpile-a', 'gold', sp).should.eql(1);
		stockpile.qty('stockpile-b', 'gold', sp).should.eql(9);
	});
})
