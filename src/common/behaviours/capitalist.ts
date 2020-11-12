import * as createDebug from "debug";
import INDUSTRIES from "../entities/industries";
import { startIndustry } from "./industry";

import { getDemandFactor, Market } from "./market";
import { Populace } from "./populace";

const debug = createDebug('eotg:behaviours:capitalist');

export function * generateCapitalistActions(populace: Populace, market: Market) {
    for (let processId in INDUSTRIES) {
        const demandFactor = getOutputDemandFactor(market, processId);

        debug(processId, demandFactor, INDUSTRIES[processId].output);

        const requiredWealth = 2000; // TODO
        if (demandFactor > 0.1 && populace.stockpile.wealth > requiredWealth) {
            yield startIndustry({
                processId,
                ownerPopulaceId: populace.id,
                wealth: requiredWealth,
                capacity: 100, // TODO
            });
            break;
        }
    }
}

function getOutputDemandFactor(market: Market, processId: string): number {
    const demandFactors = Object.keys(INDUSTRIES[processId].output)
        .map(resourceId => market.resources[resourceId] ? getDemandFactor(market.resources[resourceId]) : 0);
    return Math.max(...demandFactors);
}
