
const TAKE_RESOURCE = "take";
const GIVE_RESOURCE = "give";

export interface FiniteResourceState {
	qty: number;
}

export type FiniteResource = FiniteResourceState | undefined;

export const initialState: FiniteResource = void 0;

export function qty(state: FiniteResource) {
	return state ? state.qty : 0;
}

export function takeResource(n: number) {
	return {
		type: TAKE_RESOURCE,
		n: n
	}
}

export function giveResource(n: number) {
	return {
		type: GIVE_RESOURCE,
		n: n
	}
}

export function finiteResourceReducer(state: FiniteResource, action: any): FiniteResource {
	switch (action.type) {
		case TAKE_RESOURCE:
			if ( state && action.n <= state.qty ) {
				return {
					...state,
					qty: state.qty - action.n
				}
			}
			break;

		case GIVE_RESOURCE:
			return {
				...state,
				qty: (state ? state.qty : 0) + action.n
			}
	}

	return state;
}
