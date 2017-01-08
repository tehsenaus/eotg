
import { run } from "./engine/game-loop";
import behavioursReducer from "./behaviours/behaviours-reducer";
import { tick } from "./behaviours/time";

const initialState = {};

function * gameCycle() {
	// Advance game time
	yield tick(1);
}

export default function main() {
	return run(
		behavioursReducer,
		gameCycle(),
		initialState
	)
}
