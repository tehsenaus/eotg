
import { mapValues } from "lodash";
import { getStockpileQty, Stockpile } from "./stockpile";		
import { decayPct, ResourceDict, ResourceId } from "../entities/resources";
import { bid } from "./market";

export type ConsumerResources = ResourceDict;

export function * generateConsumerActions(stockpile: Stockpile, consumption: ConsumerResources) {
	const desiredResources = calculateDesiredResources(consumption);
	for (let resourceId in desiredResources) {
		const deficit = Math.max(0, desiredResources[resourceId] - getStockpileQty(stockpile, resourceId as ResourceId));
		if (deficit > 0) {
			yield bid({
				resourceId: resourceId as ResourceId,
				volume: deficit,
				stockpileId: stockpile.id,
				locationId: '',
			});
		}
	}
}

export function calculateDesiredResources(consumption: ConsumerResources): ConsumerResources {
	return mapValues(consumption, (consumptionAmt, resourceId) => {
		const decayPctPerUnitTime = decayPct(resourceId, 1);

		// If good is highly perishable, we don't want to hoard it
		const hoardingFactor = Math.max(
			1,
			1 / (0.2 + Math.pow(decayPctPerUnitTime, 0.33))
		);

		return consumptionAmt * hoardingFactor;
	});
}
