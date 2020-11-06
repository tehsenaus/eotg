
import { FiniteResource, qty as resourceQty, takeResource, giveResource } from "../behaviours/resource";

export const CONSUME_RESOURCES = "CONSUME_RESOURCES";

export type Stockpile = { [commodityId: string]: FiniteResource };

export interface StockpileActionSpec {
	stockpileId: string;
	resourceId: string;
}

export interface ConsumeResourcesAction {
	type: typeof CONSUME_RESOURCES;
	resourceId: string;
}

export type StockpileAction = ConsumeResourcesAction;

export function takeFromStockpile(stockpileId: string, resourceId: string, n: number) {
	return {
		fromStockpile: {
			...takeResource(n),
			stockpileId: stockpileId,
			resourceId: resourceId
		}
	}
}

export function giveToStockpile(stockpileId: string, resourceId: string, n: number) {
	return {
		toStockpile: {
			...giveResource(n),
			stockpileId: stockpileId,
			resourceId: resourceId
		}
	}
}

export function stockpileReducer(state: Stockpile, action: StockpileAction) {
	
	return state;
}
