
import { FiniteResource, qty as resourceQty, takeResource, giveResource, finiteResourceReducer } from "../behaviours/resource";

export type Stockpile = { [commodityId: string]: FiniteResource };

export interface StockpileState {
	stockpiles: { [id: string]: Stockpile };
}

export interface StockpileActionSpec {
	stockpileId: string;
	resourceId: string;
}

export interface StockpileAction {
	fromStockpile?: StockpileActionSpec;
	toStockpile?: StockpileActionSpec;
}

export const initialState: StockpileState = {
	stockpiles: {}
}

export function qty(stockpileId: string, resourceId: string, state: StockpileState): number {
	if ( stockpileId in state.stockpiles ) {
		return resourceQty( state.stockpiles[stockpileId][resourceId] );
	}

	return 0;
}

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

export function transferBetweenStockpiles(fromStockpileId: string, toStockpileId: string, resourceId: string, n: number) {
	return {
		...takeFromStockpile(fromStockpileId, resourceId, n),
		...giveToStockpile(toStockpileId, resourceId, n)
	}
}

export function stockpileReducer(initialState: StockpileState, action: StockpileAction) {
	var state = initialState;

	if ( action.fromStockpile ) {
		state = doStockpileAction(state, action.fromStockpile);
	}

	if ( action.toStockpile ) {
		if ( action.fromStockpile && state === initialState ) {
			// If this is a transfer and the previous state didn't change, then we couldn't take the
			// resource from the source stockpile, and the transfer fails.
		} else {
			state = doStockpileAction(state, action.toStockpile);
		}
	}

	return state;
}

function doStockpileAction(state: StockpileState, stockpileAction: StockpileActionSpec): StockpileState {
	const stockpileId = stockpileAction.stockpileId;
	const resourceId = stockpileAction.resourceId;

	const stockpile = state.stockpiles[stockpileId];

	const oldResourceState = stockpile && stockpile[resourceId];
	const newResourceState = finiteResourceReducer(oldResourceState, stockpileAction);

	if ( newResourceState === oldResourceState ) return state;

	return {
		...state,
		stockpiles: {
			...state.stockpiles,
			[stockpileId]: {
				...stockpile,
				[resourceId]: newResourceState
			}
		}
	}
}
