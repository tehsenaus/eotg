import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createStore } from 'redux';
import { gameLogicReducer } from '../common/eotg';

const WINDOW = window as any;

const reducer = gameLogicReducer;

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
