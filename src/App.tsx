import React from 'react';
import logo from './logo.svg';

import './App.css';
import EconomyNav from './ui/components/navbar/EconomyNav';
import MarketsNav from './ui/components/navbar/MarketsNav';
import { useSelector } from 'react-redux';
import PopulationNav from './ui/components/navbar/PopulationNav';
import { GameState } from './common/eotg';

function App() {
  const state = useSelector<GameState, GameState>(state => state);

  return (
    <div className="App">
      <header className="App-header">
        
        <EconomyNav />
        <MarketsNav />
        <PopulationNav populaces={Object.values(state.locality.populaces)} />

        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;