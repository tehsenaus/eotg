
import * as _ from "lodash";
import { StockpileState, qty } from "./stockpile";
import { TraderState, marketPrice } from "./trader";

import * as createDebug from "debug";
const debug = createDebug('empires:behaviours:industry');

export const PRODUCE = "industry-produce";

export interface IndustrialProcess {
	id: string;
	input: { [resourceId: string]: number };
	output: { [resourceId: string]: number };
}

export interface Industry {
	id: string;
	stockpileId: string;
	traderId: string;

	// How many units of work the industry can do per produce cycle
	capacity: number;

	process: IndustrialProcess;
}

export interface IndustryState extends StockpileState, TraderState {
	industries: { [id: string]: Industry };
}

export function industryReducer(state: IndustryState, action: any): IndustryState {
	switch (action.type) {
		case PRODUCE:
			return produce(state);
	}

	return state;
}

export function produce(state: IndustryState): IndustryState {
	return {
		...state,
		industries: _.mapValues(industry => {

			// Estimate profitability of running the industry
			const profitMargin = estimateProfitMargin(industry.process, industry.traderId, state);

			if ( profitMargin > 1 ) {
				debug('%s: produce: producing', industry.id);

				var inputStockWorkUnits = _.mapValues(
					industry.process.input,
					(n, resourceId) => qty(industry.stockpileId, resourceId, state) / n
				)
			}

		})
	}
}

export function estimateProfitMargin(process: IndustrialProcess, traderId: string, state: IndustryState) {
	const inputsPricePerWorkUnit = estimatePricePerWorkUnit(process.input, traderId, state);
	const outputsPricePerWorkUnit = estimatePricePerWorkUnit(process.output, traderId, state);

	const profitMargin = outputsPricePerWorkUnit / inputsPricePerWorkUnit;

	debug('%s: estimateProfitMargin: %d / %d = %d',
		process.id, inputsPricePerWorkUnit, outputsPricePerWorkUnit, profitMargin);

	return profitMargin;
}

export function estimatePricePerWorkUnit(resources: { [id: string]: number }, traderId: string, state: IndustryState) {
	return _(resources).keys().sumBy(
		resourceId => marketPrice(resourceId, traderId, state) * resources[resourceId]
	)
}
