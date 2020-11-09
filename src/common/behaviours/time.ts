
export const TICK = "tick";

export interface TickAction {
	type: typeof TICK;
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
		type: TICK,
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
