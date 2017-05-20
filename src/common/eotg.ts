
import { run } from "./engine/game-loop";
import { fixedTimeStepScheduler } from "./engine/scheduler";
import behavioursReducer from "./behaviours/behaviours-reducer";
import { time, tick, TimeState } from "./behaviours/time";
import { trade } from "./behaviours/market";

export const gameLogicReducer = behavioursReducer;

export const defaultInitialState = [

].reduce(gameLogicReducer, {});


// These are the actions which are dispatched on each iteration
// of the game loop.
function * gameCycle() {
	yield trade();

	// Advance game time
	yield tick(1);
}

export default function main(reducer = gameLogicReducer, initialState = defaultInitialState) {
	const gameLoopGenerator = run(
		reducer,
		Array.from(gameCycle()),
		initialState
	);

	return fixedTimeStepScheduler(
		{
			gameTimeUnitsPerSecond: 1
		},
		getTime(gameLoopGenerator)
	)
}

function * getTime(gameLoopGenerator: Iterator<TimeState>) {
	while ( true ) {
		const res = gameLoopGenerator.next();
		if ( res.done ) return;
		yield time(res.value);
	}
}
