import { mapValues } from "lodash";
import { applyConsumeResources, getAvailableAmounts, Stockpile, stockpileReducer, sumResourceAmounts } from "./stockpile";
import { WorkAction, WORK, EmployeeWorkAction, WORK_EMPLOYEE } from "./labour";
import { PopulaceClassId, POPULACE_CLASSES } from "../entities/populace-classes";
import { generateConsumerActions } from "./consumer";
import { TICK, TickAction } from "./time";
import { Modifier, applyModifiers } from "../engine/modifier";
import { OFFER, Offer, offer, Order, Trade, TRADE } from "./market";
import { act } from "react-dom/test-utils";

export interface Populace {
	id: string;
	populaceClassId: PopulaceClassId;

	population: number;
	stockpile: Stockpile;
	
	health: number;

	births?: number;
	deaths?: number;
	lifeNeedsSatisfactionPct?: number;
}

export type PopulaceModifier = Modifier<Populace>;

const BASE_BIRTHS_PER_1000_PER_YEAR = 30;
const BIRTH_RATE_MODIFIERS: PopulaceModifier [] = [
	{
		id: 'base',
		valueAccessor: populace => BASE_BIRTHS_PER_1000_PER_YEAR / 365 / 1000,
	}
];

const HEALTHY_DAILY_DEATH_PROBABILITY = 1 / 85 / 365;
const UNHEALTHY_DAILY_DEATH_PROBABILITY = 1 / 5 / 365;
const DEATH_RATE_MODIFIERS: PopulaceModifier [] = [
	{
		id: 'base',
		valueAccessor: populace => HEALTHY_DAILY_DEATH_PROBABILITY,
	},
	{
		id: 'health',
		valueAccessor: populace => UNHEALTHY_DAILY_DEATH_PROBABILITY * (1 - populace.health),
	}
];

const HEALTH_MODIFIERS: PopulaceModifier [] = [
	{
		id: 'base',
		valueAccessor: populace => 0,
	},
	{
		id: 'lifeNeeds',
		valueAccessor: populace => -0.01 * (1 - populace.lifeNeedsSatisfactionPct),
	},
	{
		id: 'births',
		// assume babies are born with health=1: take weighted average to get new health
		valueAccessor: populace => 
			((populace.births + populace.health * getPriorPopulation(populace)) / populace.population)
			- populace.health,
	},
];

const LABOUR_MODIFIERS: PopulaceModifier [] = [
	{
		id: 'base',
		valueAccessor: populace => populace.population * 0.5,
	},
	{
		id: 'health',
		valueAccessor: populace => -0.5 * (1 - populace.health) * populace.population,
	}
];

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

export type PopulaceAction = TickAction | PopulaceGrowth | PopulaceMigration | WorkAction | EmployeeWorkAction
	| Trade | Offer;

export function * generatePopulaceActions(populace: Populace) {
	const populaceClass = POPULACE_CLASSES[populace.populaceClassId];

	const consumerResources = mapValues(
		populaceClass.dailyNeedsPerCapita.life,
		amountPerCapita => populace.population * amountPerCapita
	);

	yield * generateConsumerActions(populace.stockpile, consumerResources);
	
	yield offer({
		resourceId: 'unskilledLabour',
		stockpileId: populace.stockpile.id,
		volume: applyModifiers(populace, LABOUR_MODIFIERS),
		locationId: '', // TODO,
	})

	// TODO: migration

	// TODO: work
}

export function populaceReducer(state: Populace, action: PopulaceAction): Populace {
	switch (action.type) {
		case TICK: {
			const populaceClass = POPULACE_CLASSES[state.populaceClassId];

			const lifeNeedsResources = mapValues(
				populaceClass.dailyNeedsPerCapita.life,
				amountPerCapita => state.population * amountPerCapita
			);
			
			const availableAmounts = getAvailableAmounts(state.stockpile, lifeNeedsResources);
			const availableAmount = sumResourceAmounts(availableAmounts);
			const desiredAmount = sumResourceAmounts(lifeNeedsResources);
			const lifeNeedsSatisfactionPct = availableAmount / desiredAmount;

			const births = state.population * getBirthRate(state);
			const deaths = state.population * getDeathRate(state);

			state = {
				...state,
				stockpile: applyConsumeResources(state.stockpile, lifeNeedsResources),
				lifeNeedsSatisfactionPct,
				population: state.population + births - deaths,
				births,
				deaths,
			}

			const health = Math.max(0, state.health + applyModifiers(state, HEALTH_MODIFIERS));

			return {
				...state,
				health: health,
				stockpile: stockpileReducer(state.stockpile, action),
			}
		}

		case OFFER: {
			if (action.stockpileId === state.stockpile.id && action.resourceId === 'unskilledLabour') {
				return {
					...state,
					stockpile: applyConsumeResources(state.stockpile, {
						unskilledLabour: -action.volume,
					}),
				}
			}
			return state;
		}
		case TRADE: {
			return {
				...state,
				stockpile: stockpileReducer(state.stockpile, action),
			}
		}

		case WORK: {
			return action.employeeActions.reduce(populaceReducer, state);
		}
		case WORK_EMPLOYEE: {
			if (action.populaceId == state.id) {
				return {
					...state,
					stockpile: {
						...state.stockpile,
						wealth: state.stockpile.wealth + action.salaryPaid,
					},
				}
			}
		}
	}
	return state;
}

export function getBirthRate(populace: Populace) {
	return applyModifiers(populace, BIRTH_RATE_MODIFIERS);
}

export function getDeathRate(populace: Populace) {
	return applyModifiers(populace, DEATH_RATE_MODIFIERS);
}

export function getPriorPopulation(populace: Populace): number {
	return populace.population - populace.births + populace.deaths;
}
