import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createStore } from 'redux';
import { TICK } from '../common/behaviours/time';
import { defaultInitialState, gameLogicReducer, GameState } from '../common/eotg';

const WINDOW = window as any;

export interface State {
	gameState: GameState;
	gameStateHistory: GameState [];
}

const INITIAL_STATE = {
	gameState: defaultInitialState,
	gameStateHistory: [],
}

function reducer(state: State = INITIAL_STATE, action: any): State {
	state = {
		...state,
		gameState: gameLogicReducer(state.gameState, action),
	}

	if (action.type === TICK) {
		state = {
			...state,
			gameStateHistory: [
				...state.gameStateHistory,
				state.gameState,
			]
		}
	}
	
	return state;
}

export const store = WINDOW.store = createStore(
	reducer,
	WINDOW.__REDUX_DEVTOOLS_EXTENSION__ && WINDOW.__REDUX_DEVTOOLS_EXTENSION__()
);

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
