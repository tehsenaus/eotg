import * as createDebug from "debug";

const debug = createDebug('eotg:engine:game-loop');

export function * run(reducer, tickGameLoop) {
	// get the initial state
	let state = reducer(undefined, { type: '' });

	while(true) {
		const gameLoopActions = tickGameLoop(state);
		while(true) {
			const { value: action, done } = gameLoopActions.next(state);
			if (done) {
				break;
			}

			debug('executing action:', action);
			
			var userAction = yield state;
			while ( userAction ) {
				state = reducer(state, userAction);
				userAction = yield state;
			}

			state = reducer(state, action);
		}
	}
}
