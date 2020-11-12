
import * as _ from "lodash";
import * as createDebug from "debug";
import { sum } from "d3-array";
import { ResourceId, resourceTypes } from "../entities/resources";
import { EntityDict } from "./game-entity";
import { TickStartAction, TICK_START } from "./time";

const debug = createDebug('eotg:behaviours:market');

export const TRADING_START = "market-trading-start";
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

export interface TradingStartAction {
    type: typeof TRADING_START;
}

export interface Order<Type> {
    type: Type;
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

export type Bid = Order<typeof BID>;
export type Offer = Order<typeof OFFER>;

export interface Trade {
    type: typeof TRADE;
    price: number;
    volume: number;
    bid: Bid;
    offer: Offer;
}

export interface MarketResource {
    bids: Bid [];
    offers: Offer []; // sorted by price, ascending
    
    volume: number;
    avgPrice: number;

    lastBids?: Bid [];
    lastOffers?: Offer [];
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

export type MarketAction = TickStartAction | TradingStartAction | Bid | Offer | Trade;

export function startTrading(): TradingStartAction {
    return { type: TRADING_START };
}

export function bid(props: Omit<Bid, 'type'>): Bid {
    return {
        type: BID,
        ...props,
    }
}

export function offer(props: Omit<Offer, 'type'>): Offer {
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
    const bidVolume = sum(marketResource.bids, d => d.volume);
    const offerVolume = sum(marketResource.offers, d => d.volume);

    if (offerVolume === 0 || bidVolume === 0) {
        return;
    }

    const bidsFillPct = Math.min(1, offerVolume / bidVolume);
    const offersFillPct = Math.min(1, bidVolume / offerVolume);

    let bidIndex = 0;
    let offerIndex = 0;
    let bidVolumeTaken = 0;
    let offerVolumeTaken = 0;

    debug('%s: bidFillPct=%s offersFillPct=%s', marketResource, bidsFillPct, offersFillPct);

    while (bidIndex < marketResource.bids.length && offerIndex < marketResource.offers.length) {
        const bid = marketResource.bids[bidIndex];
        const offer = marketResource.offers[offerIndex];

        const bidVolume = bid.volume * bidsFillPct;
        const offerVolume = offer.volume * offersFillPct;
        const volume = Math.min(bidVolume - bidVolumeTaken, offerVolume - offerVolumeTaken);

        debug('trade', bidIndex, offerIndex, volume, bidVolume, bidVolumeTaken, offerVolume, volume);

        yield trade({
            volume,
            price: marketResource.avgPrice,
            bid,
            offer,
        });

        bidVolumeTaken += volume;
        if (bidVolumeTaken >= bidVolume) {
            bidIndex++;
            bidVolumeTaken = 0;
        }

        offerVolumeTaken += volume;
        if (offerVolumeTaken >= offerVolume) {
            offerIndex++;
            offerVolumeTaken = 0;
        }
    }
}

export function marketReducer(state: Market, action: MarketAction): Market {
    switch (action.type) {
        case TICK_START: {
            return {
                ...state,
                resources: _.mapValues(
                    state.resources,
                    (marketResource) => ({
                        ...marketResource,
                        bids: [],
                        offers: [],
                        volume: 0,
                        lastBids: marketResource.bids,
                        lastOffers: marketResource.offers,
                        avgPrice: updatePrice(marketResource),
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
        case TRADE: {
            return {
                ...state,
                resources: {
                    ...state.resources,
                    [action.bid.resourceId]: {
                        ...state.resources[action.bid.resourceId],
                        volume: state.resources[action.bid.resourceId].volume + action.volume,
                    }
                }
            }
        }
    }
    return state;
}

export function getGDP(market: Market) {
    return sum(
        Object.values(market.resources),
        d => d.volume * d.avgPrice
    ) * 365;
}

export function getDemandFactor(marketResource: MarketResource): number {
    const offerVolume = sum(marketResource.offers, d => d.volume);
    const bidVolume = sum(marketResource.bids, d => d.volume);

    if (offerVolume === 0 && bidVolume === 0) {
        return 0;
    }

    const demandFactor = (bidVolume - offerVolume) / Math.max(bidVolume, offerVolume);

    return demandFactor;
}

function updatePrice(marketResource: MarketResource): number {
    const demandFactor = getDemandFactor(marketResource);

    return (1 + 0.01 * demandFactor) * marketResource.avgPrice;
}
