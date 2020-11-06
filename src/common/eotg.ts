
import { run } from "./engine/game-loop";
import { fixedTimeStepScheduler } from "./engine/scheduler";
import { time, tick, TimeState, timeReducer } from "./behaviours/time";
import { createMarket, MarketLevel } from "./behaviours/market";
import { generateLocalityActions, Locality, localityReducer } from "./behaviours/locality";

export interface GameState {
	gameTime: TimeState;
	locality: Locality;
}

const EMPTY_STATE: GameState = {
	gameTime: {
		time: 0,
	},
	locality: {
		id: 'home',
		populaces: {
			'': {
				id: '',
				population: 10000,
				health: 1,
				wealth: 10000,
				stockpile: {
					
				}
			},
		},
		market: createMarket({
			locationId: 'home',
			level: MarketLevel.LOCAL,
		}),
	}
};

export const defaultInitialState: GameState = [

].reduce(gameLogicReducer, EMPTY_STATE);


// These are the actions which are dispatched on each iteration
// of the game loop.
function * generateGameLoopActions(state: GameState) {
	yield * generateLocalityActions(state.locality);

	// Advance game time
	yield tick(1);
}

export function gameLogicReducer(state: GameState = defaultInitialState, action): GameState {
	return {
		gameTime: timeReducer(state.gameTime, action),
		locality: localityReducer(state.locality, action),
	}
}

export default function main(reducer = gameLogicReducer, initialState = defaultInitialState) {
	const gameLoopGenerator = run(
		reducer,
		generateGameLoopActions,
		initialState
	);

	return fixedTimeStepScheduler(
		{
			gameTimeUnitsPerSecond: 1
		},
		getTime(gameLoopGenerator)
	)
}

function * getTime(gameLoopGenerator: Iterator<GameState>) {
	while ( true ) {
		const res = gameLoopGenerator.next();
		if ( res.done ) return;
		yield time(res.value.gameTime);
	}
}
