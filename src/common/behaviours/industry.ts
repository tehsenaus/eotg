
import { mapValues } from "lodash";
import { offer, Trade, TRADE, TradingStartAction, TRADING_START } from "./market";
import { TraderState, marketPrice } from "./trader";

import * as createDebug from "debug";
import { TICK, TickAction, TickStartAction } from "./time";
import { applyConsumeResources, getStockpileQty, Stockpile, stockpileReducer } from "./stockpile";
import { IndustrialProcess, INDUSTRIES } from "../entities/industries";
import { calculateDesiredResources, generateConsumerActions } from "./consumer";
import { ResourceDict, ResourceId } from "../entities/resources";
import { updateExponentialMovingAvgDict } from "../engine/stats";

const debug = createDebug('eotg:behaviours:industry');

export interface Industry {
	id: string;
	process: IndustrialProcess;

	stockpile: Stockpile;

	// How many units of work the industry can do per produce cycle
	capacity: number;

	lastWealth: number;
	initialWealth: number;
	initialCapacity: number;
	lastCapacityUsed: number;
	lastSales: ResourceDict;
	rollingLastSales: ResourceDict;
}

export type IndustryAction = Trade | TickAction | TradingStartAction;

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
		initialWealth: wealth,
		lastWealth: wealth,
		capacity: capacity,
		initialCapacity: capacity / 10,
		lastCapacityUsed: 0,
		lastSales: {},
		rollingLastSales: {},
	}
}

export function * generateIndustryActions(industry: Industry) {
	const desiredCapacity = getDesiredCapacity(industry);
	const capacity = Math.min(desiredCapacity, industry.capacity);

	const inputs = mapValues(
		industry.process.input,
		amount => amount * capacity
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
		case TRADING_START: {
			return {
				...state,
				lastSales: {},
				lastWealth: state.stockpile.wealth,
			}
		}
		case TRADE: {
			if (action.offer.stockpileId === state.stockpile.id) {
				state = {
					...state,
					lastSales: {
						...state.lastSales,
						[action.offer.resourceId]: (state.lastSales[action.offer.resourceId] || 0) + action.volume,
					}
				}
			}
			return {
				...state,
				stockpile: stockpileReducer(state.stockpile, action),
			}
		}
		case TICK: {
			state = applyProduce(state);
			state = maybeExpand(state);
			return {
				...state,
				stockpile: stockpileReducer(state.stockpile, action),
				rollingLastSales: updateExponentialMovingAvgDict(0.5, state.rollingLastSales, state.lastSales),
			}
		}
	}

	return state;
}

export function getLastProfit(industry: Industry): number {
	return industry.stockpile.wealth - industry.lastWealth;
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
		lastCapacityUsed: capacityAvailable,
		stockpile: applyConsumeResources(
			applyConsumeResources(industry.stockpile, inputsConsumed),
			outputsProduced
		),
	}
}

function maybeExpand(industry: Industry): Industry {
	if (industry.lastCapacityUsed < industry.capacity - industry.initialCapacity) {
		return industry;
	}
	if (getLastProfit(industry) > 0 && industry.stockpile.wealth >= industry.initialWealth * 2) {
		console.log('expand', industry);
		return {
			...industry,
			stockpile: {
				...industry.stockpile,
				wealth: industry.stockpile.wealth - industry.initialWealth,
			},
			capacity: industry.capacity + industry.initialCapacity,
		}
	}
	return industry;
}

function getDesiredCapacity(industry: Industry) {
	// special case for start
	if (industry.lastWealth === industry.initialWealth) {
		return industry.capacity;
	}

	const desiredResources = calculateDesiredResources(industry.rollingLastSales);
	const desiredCapacity = Math.max(...Object.values(mapValues(
		desiredResources,
		(desiredAmount, resourceId) =>
			(desiredAmount - (
				getStockpileQty(industry.stockpile, resourceId as ResourceId)
				- Math.max(industry.lastSales[resourceId], industry.rollingLastSales[resourceId])
			))
			/ industry.process.output[resourceId]
	)));

	console.log('desired-capacity', desiredCapacity, industry.lastSales, industry.stockpile.resources, desiredResources);

	return Math.max(0, desiredCapacity);
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
