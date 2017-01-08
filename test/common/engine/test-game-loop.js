

const should = require('should');
const gameLoop = require('../../../lib/common/engine/game-loop');
const time = require('../../../lib/common/behaviours/time');

describe('Game Loop', function () {

	it('executes list of game actions on every iteration', function () {

		var gameStateIterator = gameLoop.run(
			time.timeReducer,
			[
				time.tick(1)
			],
			{}
		);

		var state0 = gameStateIterator.next().value;
		time.time(state0).should.eql(0);

		var state1 = gameStateIterator.next().value;
		time.time(state1).should.eql(1);

		var state2 = gameStateIterator.next().value;
		time.time(state2).should.eql(2);
	});

	it('executes user actions between iterations', function () {

		var gameStateIterator = gameLoop.run(
			time.timeReducer,
			[
				time.tick(1)
			],
			{}
		);

		var state0 = gameStateIterator.next().value;
		time.time(state0).should.eql(0);

		var state1 = gameStateIterator.next(
			time.tick(10)
		).value;
		time.time(state1).should.eql(10);

		var state2 = gameStateIterator.next().value;
		time.time(state2).should.eql(11);
	});
});
