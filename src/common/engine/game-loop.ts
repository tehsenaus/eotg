
export function * run(reducer, tickGameLoop, state) {
	while(true) {
		const gameLoopActions = tickGameLoop(state);
		for ( let action of gameLoopActions ) {
			console.log('game-loop: executing action:', action);
			
			var userAction = yield state;
			while ( userAction ) {
				state = reducer(state, userAction);
				userAction = yield state;
			}

			state = reducer(state, action);
		}
	}
}
