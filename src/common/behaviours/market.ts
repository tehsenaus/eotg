
import * as _ from "lodash";

export const OFFER = "market-offer";
export const BID = "market-bid";
export const TRADE = "market-trade";

export enum MarketLevel {
    LOCAL = 0,
    REGIONAL = 1,
    NATIONAL = 2,
    COMMON = 3,
    GLOBAL = 4,
}

export interface Order {
    type: typeof OFFER | typeof BID;
    price: number;
    volume: number;

    // In the case of an offer (to sell), who can see this?
    // In the case of a bid (to buy), how far up the market hierarchy can we look for offers?
    scope: MarketLevel;

    // TODO: factor in transport costs
    locationId: string;
}

export interface Trade {
    type: typeof TRADE;
    price: number;
    volume: number;
    buyOrder: Order;
    sellOrder: Order;
}

export interface Market {
    level: MarketLevel;
    locationId: string;

    offers: Order []; // sorted by price, ascending
    
    volume: number;
    avgPrice: number;
}

export interface MarketTrades {
    market: Market;
    trades: Trade [];
}

export interface MarketState {
    markets: { [id: string]: { [resourceId: string]: Market } };
}

export function trade() {
    return {
        type: TRADE
    }
}

export function createMarket(lastPrice = 1) {
    return {
        orderBook: {
            bids: [], asks: []
        },
        volume: 0,
        avgPrice: lastPrice
    }
}


