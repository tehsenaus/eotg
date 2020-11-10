
import { mapValues } from "lodash";
import { gameEntityReducer } from "./game-entity";
import { offer, Trade, TRADE } from "./market";
import { TraderState, marketPrice } from "./trader";

import * as createDebug from "debug";
import { TICK, TickAction } from "./time";
import { applyConsumeResources, getStockpileQty, Stockpile, stockpileReducer } from "./stockpile";
import { IndustrialProcess, INDUSTRIES } from "../entities/industries";
import { generateConsumerActions } from "./consumer";
import { ResourceId } from "../entities/resources";
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

	for (let resourceId in industry.process.output) {
		const amount = getStockpileQty(industry.stockpile, resourceId as ResourceId);
		if (amount > 0) {
			yield offer({
				resourceId: resourceId as ResourceId,
				volume: amount,
				locationId: '', // TODO
				stockpileId: industry.stockpile.id,
			});
		}
	}
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
			state = applyProduce(state);
			return {
				...state,
				stockpile: stockpileReducer(state.stockpile, action),
			}
		}
	}

	return state;
}

function applyProduce(industry: Industry): Industry {
	const capacityAvailable = Math.min(...Object.values(mapValues(
		industry.process.input,
		(amount, resourceId) => getStockpileQty(industry.stockpile, resourceId as ResourceId) / amount
	)));
	
	const inputsConsumed = mapValues(
		industry.process.input,
		amount => amount * capacityAvailable
	);
	const outputsProduced = mapValues(
		industry.process.output,
		amount => -amount * capacityAvailable
	);

	console.log('produce', capacityAvailable, outputsProduced);

	return {
		...industry,
		stockpile: applyConsumeResources(
			applyConsumeResources(industry.stockpile, inputsConsumed),
			outputsProduced
		),
	}
}

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
