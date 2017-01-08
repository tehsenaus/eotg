
export const TICK = "tick";

export interface TickAction {
	deltaTime: number;
}

export interface TimeState {
	time: number;
}

export function time(state: TimeState) {
	return state.time || 0;
}

// The tick action indicates forward progress in simulated game time.
export function tick(deltaTime: number): TickAction {
	return {
		deltaTime: deltaTime
	}
}

export function timeReducer(state: TimeState, action): TimeState {
	if ( action.deltaTime ) {
		state = {
			...state,
			time: (state.time || 0) + action.deltaTime
		}
	}

	return state;
}
