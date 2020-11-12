import {mapValues} from "lodash";
import { generateCapitalistActions } from "./capitalist";
import { EntityDict } from "./game-entity";
import { createIndustry, generateIndustryActions, Industry, IndustryAction, industryReducer, StartIndustryAction, START_INDUSTRY } from "./industry";
import { generateMarketActions, Market, marketReducer, offer } from "./market";
import { NaturalResourceDict } from "./natural-resource";
import { generatePopulaceActions, Populace, PopulaceAction, populaceReducer } from "./populace";

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

export type LocalityAction = StartIndustryAction | any;

export function * generateLocalityActions(locality: Locality) {
    for (const populaceId of Object.keys(locality.populaces)) {
        yield * generatePopulaceActions(locality.populaces[populaceId]);
    }

    yield * generateCapitalistActions(locality.populaces['capitalist'], locality.market);

    for (const industryId in locality.industries) {
        yield * generateIndustryActions(locality.industries[industryId]);
    }
}

export function * generateLocalityTrades(locality: Locality) {
    yield * generateMarketActions(locality.market);
}

export function localityReducer(locality: Locality, action: LocalityAction): Locality {
    switch (action.type) {
        case START_INDUSTRY: {
            const baseId = locality.id + '/' + action.processId;
            const id = baseId + Array.from(Array(100).keys()).filter(i => !((baseId + i) in locality.industries))[0];
            const industry = createIndustry({
                ...action,
                id,
            });
            return {
                ...locality,
                industries: {
                    ...locality.industries,
                    [industry.id]: industry,
                },
                populaces: {
                    ...locality.populaces,
                    capitalist: populaceReducer(locality.populaces.capitalist, action),
                }
            }
        }
    }

    return {
        ...locality,
        populaces: mapValues(locality.populaces, populace => populaceReducer(populace, action)),
        market: marketReducer(locality.market, action),
        industries: mapValues(locality.industries, industry => industryReducer(industry, action)),
    }
}
