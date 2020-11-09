
import * as _ from "lodash";
import { sum } from "d3-array";
import { ResourceId, resourceTypes } from "../entities/resources";
import { EntityDict } from "./game-entity";
import { TICK } from "./time";

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
    resourceId: ResourceId;
    // price: number;
    volume: number;

    // In the case of an offer (to sell), who can see this?
    // In the case of a bid (to buy), how far up the market hierarchy can we look for offers?
    // scope: MarketLevel;

    // TODO: factor in transport costs
    locationId: string;
    stockpileId: string;
}

export interface Trade {
    type: typeof TRADE;
    price: number;
    volume: number;
    bid: Order;
    offer: Order;
}

export interface MarketResource {
    bids: Order [];
    offers: Order []; // sorted by price, ascending
    
    volume: number;
    avgPrice: number;

    lastBids?: Order [];
    lastOffers?: Order [];
}

export interface Market {
    level: MarketLevel;
    locationId: string;
    resources: EntityDict<MarketResource>;
}

export interface MarketTrades {
    market: Market;
    trades: Trade [];
}

export function bid(props: Omit<Order, 'type'>): Order {
    return {
        type: BID,
        ...props,
    }
}

export function offer(props: Omit<Order, 'type'>): Order {
    return {
        type: OFFER,
        ...props,
    }
}

export function trade(props: Omit<Trade, 'type'>): Trade {
    return {
        type: TRADE,
        ...props,
    }
}

export function createMarket({ level, locationId }): Market {
    return {
        level,
        locationId,
        resources: _.mapValues(
            resourceTypes,
            () => ({
                bids: [],
                offers: [],
                volume: 0,
                avgPrice: 1,
            })
        )
    };
}

export function * generateMarketActions(market: Market) {
    for (let resourceId in market.resources) {
        yield * generateMarketResourceActions(market.resources[resourceId]);
    }
}

export function * generateMarketResourceActions(marketResource: MarketResource) {
    // Here we match bids and offers to generate trades

    const offerVolume = sum(marketResource.offers, d => d.volume);
    const bidVolume = sum(marketResource.bids, d => d.volume);

    if (offerVolume === 0 || bidVolume === 0) {
        return;
    }

    const bidsFillPct = Math.min(1, offerVolume / bidVolume);
    const offersFillPct = Math.min(1, bidVolume / offerVolume);

    for (let bid of marketResource.bids) {
        const volume = bid.volume * bidsFillPct;
        yield trade({
            volume,
            price: marketResource.avgPrice,
            bid,
            offer: offer({
                resourceId: bid.resourceId,
                volume,
                stockpileId: '<dummy>',
                locationId: '',
            })
        })
    }
}

export function marketReducer(state: Market, action): Market {
    switch (action.type) {
        case TICK: {
            return {
                ...state,
                resources: _.mapValues(
                    state.resources,
                    (marketResource) => ({
                        ...marketResource,
                        bids: [],
                        offers: [],
                        lastBids: marketResource.bids,
                        lastOffers: marketResource.offers,
                    })
                )
            }
        }
        case BID: {
            return {
                ...state,
                resources: {
                    ...state.resources,
                    [action.resourceId]: {
                        ...state.resources[action.resourceId],
                        bids: [
                            ...state.resources[action.resourceId].bids,
                            action
                        ]
                    }
                }
            }
        }
        case OFFER: {
            return {
                ...state,
                resources: {
                    ...state.resources,
                    [action.resourceId]: {
                        ...state.resources[action.resourceId],
                        offers: [
                            ...state.resources[action.resourceId].offers,
                            action
                        ]
                    }
                }
            }
        }
    }
    return state;
}
