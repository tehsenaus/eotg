
import { Stockpile } from "./stockpile";
import { WorkAction, WORK, EmployeeWorkAction, WORK_EMPLOYEE } from "./labour";

export interface Populace {
	id: string;
	population: number;
	stockpile: Stockpile;
	
	health: number;
	wealth: number;
}

const GROW = "POPULACE_GROWTH";
const MIGRATE = "POPULACE_MIGRATION";

export interface PopulaceGrowth {
	type: "POPULACE_GROWTH";
	id: string;
	births: number;
	deaths: number;
}

export interface PopulaceMigration {
	type: "POPULACE_MIGRATION";
	fromId: string;
	toId: string;
	populationMigrated: number;
}

export type PopulaceAction = PopulaceGrowth | PopulaceMigration | WorkAction | EmployeeWorkAction;

export function * generatePopulaceActions(populace: Populace) {
	const birthRate = 0.0001;
	const deathRate = 0.00005;

	const births = populace.population * birthRate;
	const deaths = populace.population * deathRate;

	yield {
		type: GROW,
		id: populace.id,
		births,
		deaths,
	}

	// TODO: migration

	// TODO: work
}

export function populaceReducer(state: Populace, action: PopulaceAction): Populace {
	switch (action.type) {
		case GROW: {
			return {
				...state,
				population: state.population + action.births - action.deaths,
			}
		}

		case WORK: {
			return action.employeeActions.reduce(populaceReducer, state);
		}
		case WORK_EMPLOYEE: {
			if (action.populaceId == state.id) {
				return {
					...state,
					wealth: state.wealth + action.salaryPaid,
				}
			}
		}
	}
	return state;
}
