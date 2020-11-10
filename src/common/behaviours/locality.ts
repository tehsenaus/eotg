import {mapValues} from "lodash";
import { EntityDict } from "./game-entity";
import { generateIndustryActions, Industry, industryReducer } from "./industry";
import { generateMarketActions, Market, marketReducer, offer } from "./market";
import { NaturalResourceDict } from "./natural-resource";
import { generatePopulaceActions, Populace, populaceReducer } from "./populace";

/**
 * A locality is the most granular region in the game, where populaces live.
 */
export interface Locality {
    id: string;
    populaces: EntityDict<Populace>;
    market: Market;
    naturalResources: NaturalResourceDict;
    industries: EntityDict<Industry>;
}

export function * generateLocalityActions(locality: Locality) {
    for (const populaceId of Object.keys(locality.populaces)) {
        yield * generatePopulaceActions(locality.populaces[populaceId]);
    }

    for (const industryId in locality.industries) {
        yield * generateIndustryActions(locality.industries[industryId]);
    }
}

export function * generateLocalityTrades(locality: Locality) {
    yield * generateMarketActions(locality.market);
}

export function localityReducer(locality: Locality, action): Locality {
    return {
        ...locality,
        populaces: mapValues(locality.populaces, populace => populaceReducer(populace, action)),
        market: marketReducer(locality.market, action),
        industries: mapValues(locality.industries, industry => industryReducer(industry, action)),
    }
}
