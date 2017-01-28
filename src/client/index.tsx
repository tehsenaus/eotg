import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore } from 'redux'

import 'react-mdl/extra/material.js';
import 'react-mdl/extra/material.css'

import Index from "./components/Index";
import reducer from './reducers'

import eotg from "../common/eotg";

const WINDOW = window as any;

const store = WINDOW.store = createStore(
    reducer,
    WINDOW.__REDUX_DEVTOOLS_EXTENSION__ && WINDOW.__REDUX_DEVTOOLS_EXTENSION__()
);
const rootEl = document.getElementById('root')

const render = () => ReactDOM.render(
    <Index store={store}></Index>,
  rootEl
)

render()
store.subscribe(render)

eotg((state, action) => {
    store.dispatch(action);
    return store.getState();
});
