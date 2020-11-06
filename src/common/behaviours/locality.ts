import {mapValues} from "lodash";
import { EntityDict } from "./game-entity";
import { Market } from "./market";
import { generatePopulaceActions, Populace, populaceReducer } from "./populace";

/**
 * A locality is the most granular region in the game, where populaces live.
 */
export interface Locality {
    id: string;
    populaces: EntityDict<Populace>;
    market: Market;
}

export function * generateLocalityActions(locality: Locality) {
    for (const populaceId of Object.keys(locality.populaces)) {
        yield * generatePopulaceActions(locality.populaces[populaceId]);
    }
}

export function localityReducer(locality: Locality, action): Locality {
    return {
        ...locality,
        populaces: mapValues(locality.populaces, populace => populaceReducer(populace, action)),
    }
}
