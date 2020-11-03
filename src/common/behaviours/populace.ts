
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

function * generatePopulaceActions(populace: Populace) {
	const births = populace.population * birthRate;
	const deaths = populace.population * deathRate;

	yield {
		type: GROW,
		id: populace.id,
		births,
		deaths,
	}
}

function populaceReducer(action: PopulaceAction, state: Populace): Populace {
	switch (action.type) {
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
