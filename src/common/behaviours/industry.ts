
import _ from "lodash";
import { gameEntityReducer } from "./game-entity";
import { StockpileState, qty } from "./stockpile";
import { TRADE } from "./market";
import { TraderState, marketPrice } from "./trader";

import * as createDebug from "debug";
const debug = createDebug('empires:behaviours:industry');

const createIndustryReducer = gameEntityReducer('industries');

export const PRODUCE = "industry-produce";

export type IndustrialProcessType = 'primary' | 'secondary';

export interface IndustrialProcess {
	id: string;
	type: IndustrialProcessType;
	input: { [resourceId: string]: number };
	output: { [resourceId: string]: number };
}

export interface Industry {
	id: string;
	stockpileId: string;
	traderId: string;

	process: IndustrialProcess;

	// How many units of work the industry can do per produce cycle
	capacity: number;
}
export interface PrimaryIndustry extends Industry {
	naturalResourceId: string;
}

export interface IndustryState extends StockpileState, TraderState {
	industries: { [id: string]: Industry };
}

export function industryReducer(state: IndustryState, action: any): IndustryState {
	switch (action.type) {
		case TRADE:
			return applyTrade(state, action);
		case PRODUCE:
			return applyProduce(state, action);
	}

	return state;
}

export const applyTrade = createIndustryReducer((industry: Industry, action) => {
	// Estimate profitability of running the industry
	// const profitMargin = estimateProfitMargin(industry.process, industry.traderId);

	// if ( profitMargin > 1 ) {
	// 	debug('%s: trade: requesting input resources', industry.id);

	// 	var inputStockWorkUnits = _.mapValues(
	// 		industry.process.input,
	// 		(n, resourceId) => qty(industry.stockpileId, resourceId, state) / n
	// 	);


	// }

	return industry;
});

export const applyProduce = createIndustryReducer((industry: Industry, action) => {
	// Estimate profitability of running the industry
	// const profitMargin = estimateProfitMargin(industry.process, industry.traderId, state);

	// if ( profitMargin > 1 ) {
	// 	debug('%s: produce: producing', industry.id);

	// 	var inputStockWorkUnits = getInputStockWorkUnits(industry, state);


	// }

	return industry;
});

export function estimateProfitMargin(process: IndustrialProcess, traderId: string, state: IndustryState) {
	const inputsPricePerWorkUnit = estimatePricePerWorkUnit(process.input, traderId, state);
	const outputsPricePerWorkUnit = estimatePricePerWorkUnit(process.output, traderId, state);

	const profitMargin = outputsPricePerWorkUnit / inputsPricePerWorkUnit;

	debug('%s: estimateProfitMargin: %d / %d = %d',
		process.id, inputsPricePerWorkUnit, outputsPricePerWorkUnit, profitMargin);

	return profitMargin;
}

export function getInputStockWorkUnits(industry: Industry, state) {
	return _.mapValues(
		industry.process.input,
		(n, resourceId) => qty(industry.stockpileId, resourceId, state) / n
	)
}

export function estimatePricePerWorkUnit(resources: { [id: string]: number }, traderId: string, state: IndustryState) {
	return _(resources).keys().sumBy(
		resourceId => marketPrice(resourceId, traderId, state) * resources[resourceId]
	)
}
