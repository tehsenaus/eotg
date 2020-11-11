
import { run } from "./engine/game-loop";
import { fixedTimeStepScheduler } from "./engine/scheduler";
import { time, tick, TimeState, timeReducer, tickStart } from "./behaviours/time";
import { createMarket, MarketLevel, startTrading } from "./behaviours/market";
import { generateLocalityActions, generateLocalityTrades, Locality, localityReducer } from "./behaviours/locality";
import { createIndustry } from "./behaviours/industry";
import { createPopulace } from "./behaviours/populace";

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
			'unskilled': createPopulace({
				populaceClassId: 'unskilled',
				locationId: 'home',
				population: 10000,
				wealthPerCapita: 10,
			}),
			'capitalist': createPopulace({
				populaceClassId: 'capitalist',
				locationId: 'home',
				population: 10,
				wealthPerCapita: 1000,
			}),
		},
		market: createMarket({
			locationId: 'home',
			level: MarketLevel.LOCAL,
		}),
		naturalResources: {},
		industries: {
			'farm': createIndustry({
				processId: 'grainFarm',
				wealth: 1000,
			})
		}
	}
};

export const defaultInitialState: GameState = [

].reduce(gameLogicReducer, EMPTY_STATE);


// These are the actions which are dispatched on each iteration
// of the game loop.
function * generateGameLoopActions(state: GameState) {
	yield tickStart();

	yield * generateLocalityActions(state.locality);

	const nextState = yield startTrading();
	yield * generateLocalityTrades(nextState.locality);

	// Advance game time
	yield tick(1);
}

export function gameLogicReducer(state: GameState = defaultInitialState, action): GameState {
	return {
		gameTime: timeReducer(state.gameTime, action),
		locality: localityReducer(state.locality, action),
	}
}

export default function main(
		reducer = gameLogicReducer,
) {
	const gameLoopGenerator = run(
		reducer,
		generateGameLoopActions
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
