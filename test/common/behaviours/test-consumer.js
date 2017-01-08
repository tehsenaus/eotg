
const should = require('should');
const consumer = require('../../../lib/common/behaviours/consumer');


describe('Consumer', function () {

	describe('desiredResources', function () {

		it('hoards non-perishable resources', function () {

			const state = consumer.createConsumer(
				'test-consumer',
				{
					consumerResources: {
						wood: 10
					}
				},
				consumer.initialState
			);

			consumer.desiredResources('test-consumer', state).wood
				.should.be.within(30, 55);
		});

		it('requests a little more of perishable goods', function () {

			const state = consumer.createConsumer(
				'test-consumer',
				{
					consumerResources: {
						grain: 10
					}
				},
				consumer.initialState
			);


			consumer.desiredResources('test-consumer', state).grain
				.should.be.within(15, 25);
		});

		it('only requests exact amount of ephemeral goods', function () {

			const state = consumer.createConsumer(
				'test-consumer',
				{
					consumerResources: {
						unskilledLabour: 10
					}
				},
				consumer.initialState
			);

			consumer.desiredResources('test-consumer', state).unskilledLabour.should.equal(10);
		})

	})

})
