import convert from "convert-units";

export const resourceTypes = {
	water: {
		unit: 'kg',
	},
	solar: {
		halfLife: 0,
		unit: 'MJ',
	},

	unskilledLabour: {
		unit: 'man days',
		halfLife: 0
	},

	grain: {
		unit: 'kg',
		halfLife: 30
	},

	housing: {
		unit: 'man',
	},

	wood: {
		unit: 'kg',
	}
}

export type ResourceId = keyof typeof resourceTypes;
export type ResourceDict = { [P in ResourceId]?: number };

export function halfLife(resourceId: string) {
	return resourceTypes[resourceId].halfLife === void 0 ? Infinity
		: resourceTypes[resourceId].halfLife;
}

export function decayFactor(resourceId: string) {
	return -(0.693 / halfLife(resourceId));
}

export function decayPct(resourceId: string, deltaTime: number) {
	return 1 - Math.exp(decayFactor(resourceId) * deltaTime);
}

export function convertToResourceUnit(resourceId: ResourceId, amount: number, unit: string) {
	return convert(amount).from(unit).to(resourceTypes[resourceId].unit);
}
