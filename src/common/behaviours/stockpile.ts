import { mapValues } from "lodash";
import { ResourceDict, ResourceId } from "../entities/resources";
import { EntityDict } from "./game-entity";
import { TRADE, Trade } from "./market";

export const CONSUME_RESOURCES = "CONSUME_RESOURCES";
export const PRODUCE_RESOURCES = "PRODUCE_RESOURCES";

export type Stockpile = {
	id: string;
	resources: ResourceDict;
	wealth: number;
};

export interface ConsumeResourcesAction {
	type: typeof CONSUME_RESOURCES;
	stockpileId: string;
	resources: ResourceDict;
}

export interface ProduceResourcesAction {
	type: typeof PRODUCE_RESOURCES;
	stockpileId: string;
	resources: ResourceDict;
}

export type StockpileAction = ConsumeResourcesAction | Trade;

export function getStockpileQty(stockpile: Stockpile, resourceId: ResourceId): number {
	return stockpile.resources[resourceId] || 0;
}

export function getAvailableAmounts(stockpile: Stockpile, resources: ResourceDict): ResourceDict {
	return mapValues(resources, (desiredAmount, resourceId) => {
		return Math.min(desiredAmount, getStockpileQty(stockpile, resourceId as ResourceId));
	});
}

export function consumeResources(stockpileId: string, resources: ResourceDict): ConsumeResourcesAction {
	return {
		type: CONSUME_RESOURCES,
		stockpileId,
		resources,
	};
}

export function stockpileReducer(state: Stockpile, action: StockpileAction) {
	switch (action.type) {
		case CONSUME_RESOURCES: {
			return applyConsumeResources(state, action.resources);
		}
		case TRADE: {
			if (action.bid.stockpileId == state.id) {
				return {
					...state,
					wealth: state.wealth - action.price * action.volume,
					resources: {
						...state.resources,
						[action.bid.resourceId]: getStockpileQty(state, action.bid.resourceId) + action.volume,
					},
				}
			}
		}
	}
	return state;
}

export function applyConsumeResources(state: Stockpile, resources: EntityDict<number>): Stockpile {
	state = {
		...state,
		resources: {
			...state.resources,
		}
	}
	for (let resourceId in resources) {
		state.resources[resourceId] = Math.max(0, state.resources[resourceId] - resources[resourceId]);
	}
	console.log(state);
	return state;
}

export function sumResourceAmounts(resources: ResourceDict): number {
	let amount = 0;
	for (let resourceId in resources) {
		amount += resources[resourceId];
	}
	return amount;
}
