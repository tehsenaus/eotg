import { mapValues } from 'lodash';

export type EntityDict<T> = { [id: string]: T };

export type GameEntityReducer<EntityState, EntityAction> =
	(entityState: EntityState, action: EntityAction) => EntityState;

export function gameEntityGetter<EntityState>(name: string) {
	return (state, id: string) => {
		const entities = state[name];
		return entities[id];
	}
}

/**
 * Creates a reducer which applies an action to all instances of a game entity
 **/
export function gameEntityReducer<EntityState, EntityAction>(name: string) {
	return (fn: GameEntityReducer<EntityState, EntityAction>) => (state, action) => {
		var mutatedEntityCount = 0;
		const nextEntities = mapValues(state[name], entityState => {
			const nextEntityState = fn(entityState, action);

			if ( nextEntityState !== entityState ) {
				mutatedEntityCount++;
			}

			return nextEntityState;
		});

		return mutatedEntityCount > 0 ? {
			...state,
			[name]: nextEntities
		} : state;
	}
}

/**
 * Creates a reducer which applies an action to one instance of a game entity, referenced
 * by a field named *idField* inside the action.
 **/
export function singleGameEntityReducer<EntityState, EntityAction>(name: string, idField: string) {
	return (fn: GameEntityReducer<EntityState, EntityAction>) => (state, action) => {
		const id = action[idField];
		const entities = state[name];
		const entityState = entities[id];
		const nextEntityState = fn(entityState, action);

		if ( entityState !== nextEntityState ) {
			state = {
				...state,
				[name]: {
					...entities,
					[id]: nextEntityState
				}
			}
		}

		return state;
	}
}
