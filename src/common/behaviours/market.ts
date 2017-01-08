
import * as _ from "lodash";

export interface Order {
    price: number;
    volume: number;
}

export interface OrderBook {
    bids: Order [];
    asks: Order [];
}

export interface Market {
    orderBook: OrderBook;
    volume: number;
    avgPrice: number;
}

export interface Trade {
    price: number;
    volume: number;
    buyOrder: Order;
    sellOrder: Order;
}

export interface MarketTrades {
    market: Market;
    trades: Trade [];
}

export interface MarketState {
    markets: { [id: string]: { [resourceId: string]: Market } };
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

export function executeMarketOrders(market: Market): MarketTrades {
    const remainingBids = _.sortBy(market.orderBook.bids, o => o.price);
    const remainingAsks = _.sortBy(market.orderBook.asks, o => o.price);
    const trades: Trade [] = [];
    var volume = 0;
    var priceVolume = 0;

    for ( var i = 0, j = 0; i < remainingBids.length && j < remainingAsks.length; i++, j++ ) {
        let topBid = remainingBids[remainingBids.length - (i+1)],
            bottomAsk = remainingAsks[j];

        if ( topBid.price >= bottomAsk.price ) {
            let trade: Trade = {

                // Use the mid price, as we have no concept of 'aggressor'
                price: (topBid.price + bottomAsk.price) / 2,

                volume: Math.min(topBid.volume, bottomAsk.volume),

                buyOrder: topBid,
                sellOrder: bottomAsk
            }

            if ( topBid.volume > trade.volume ) {
                // This is a local copy of the array, we can safely mutate
                remainingBids[remainingBids.length - (i+1)] = {
                    ...topBid,
                    volume: topBid.volume - trade.volume
                }
                i--;
            } else if ( bottomAsk.volume > trade.volume ) {
                remainingAsks[j] = {
                    ...bottomAsk,
                    volume: bottomAsk.volume - trade.volume
                }
                j--;
            }

            trades.push(trade);
            volume += trade.volume;
            priceVolume += trade.volume * trade.price;
        }
    }

    return {
        market: {
            orderBook: {
                bids: remainingBids,
                asks: remainingAsks
            },
            volume: volume,
            avgPrice: volume > 0 ? priceVolume / volume : market.avgPrice
        },
        trades: trades
    }
}
