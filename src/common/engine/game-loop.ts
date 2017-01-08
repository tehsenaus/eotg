
export function * run(reducer, gameLoopActions, state) {
	while(true) {
		for ( let action of gameLoopActions ) {
			var userAction = yield state;
			while ( userAction ) {
				state = reducer(state, userAction);
				userAction = yield state;
			}

			state = reducer(state, action);
		}
	}
}
