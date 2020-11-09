
export const resourceTypes = {
	water: {

	},
	solar: {
		halfLife: 0,
	},

	unskilledLabour: {
		unit: 'man days',
		halfLife: 0
	},

	grain: {
		unit: 'tonne',
		halfLife: 30
	},

	housing: {

	},

	wood: {

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
