
import { mapValues } from "lodash";
import { gameEntityReducer } from "./game-entity";
import { Trade, TRADE } from "./market";
import { TraderState, marketPrice } from "./trader";

import * as createDebug from "debug";
import { TICK, TickAction } from "./time";
import { Stockpile, stockpileReducer } from "./stockpile";
import { IndustrialProcess, INDUSTRIES } from "../entities/industries";
import { generateConsumerActions } from "./consumer";
const debug = createDebug('empires:behaviours:industry');

const createIndustryReducer = gameEntityReducer('industries');

export interface Industry {
	id: string;
	process: IndustrialProcess;

	stockpile: Stockpile;

	// How many units of work the industry can do per produce cycle
	capacity: number;
}

export type IndustryAction = Trade | TickAction;

export function createIndustry({
	processId,
	wealth,
	capacity = 100,
}): Industry {
	const process = INDUSTRIES[processId];
	const id = processId; // TODO
	return {
		id,
		process,
		stockpile: {
			id: id + '/stockpile',
			wealth,
			resources: {},
		},
		capacity,
	}
}

export function * generateIndustryActions(industry: Industry) {
	const inputs = mapValues(
		industry.process.input,
		amount => amount * industry.capacity
	);

	yield * generateConsumerActions(industry.stockpile, inputs);
}

export function industryReducer(state: Industry, action: IndustryAction): Industry {
	switch (action.type) {
		case TRADE: {
			return {
				...state,
				stockpile: stockpileReducer(state.stockpile, action),
			}
		}
		case TICK: {
			return applyProduce(state, action);
		}
	}

	return state;
}

export const applyProduce = createIndustryReducer((industry: Industry, action) => {
	// Estimate profitability of running the industry
	// const profitMargin = estimateProfitMargin(industry.process, industry.traderId, state);

	// if ( profitMargin > 1 ) {
	// 	debug('%s: produce: producing', industry.id);

	// 	var inputStockWorkUnits = getInputStockWorkUnits(industry, state);


	// }

	return industry;
});

// export function estimateProfitMargin(process: IndustrialProcess, traderId: string, state: Industry) {
// 	const inputsPricePerWorkUnit = estimatePricePerWorkUnit(process.input, traderId, state);
// 	const outputsPricePerWorkUnit = estimatePricePerWorkUnit(process.output, traderId, state);

// 	const profitMargin = outputsPricePerWorkUnit / inputsPricePerWorkUnit;

// 	debug('%s: estimateProfitMargin: %d / %d = %d',
// 		process.id, inputsPricePerWorkUnit, outputsPricePerWorkUnit, profitMargin);

// 	return profitMargin;
// }

export function getInputStockWorkUnits(industry: Industry, state) {
	return mapValues(
		industry.process.input,
		// (n, resourceId) => qty(industry.stockpileId, resourceId, state) / n
		() => 0
	)
}

// export function estimatePricePerWorkUnit(resources: { [id: string]: number }, traderId: string, state: Industry) {
// 	return _(resources).keys().sumBy(
// 		resourceId => marketPrice(resourceId, traderId, state) * resources[resourceId]
// 	)
// }
