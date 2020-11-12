
export const TICK_START = "tick-start";
export const TICK = "tick";

export interface TickStartAction {
	type: typeof TICK_START;
}
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

export function tickStart(): TickStartAction {
	return {
		type: TICK_START,
	}
}

/**
 * The tick action indicates forward progress in simulated game time.
 **/
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
