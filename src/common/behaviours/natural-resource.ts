import { ResourceId } from "../entities/resources";

export interface NaturalResourceOptions {
	// naturalCapacity is the total amount of the resource which is available to
	// extract. The total amount is never extractable as the resource gets progressively
	// harder (i.e. more expensive) to extract the more is extracted.
	naturalCapacity: number;
	extractRate: number;
	regenRate?: number;
}

export interface NaturalResource extends NaturalResourceOptions {
	decay: number;
	abundance: number;
	maxAbundance: number;
	totalWork: number;
	totalAmt: number;
}

export type NaturalResourceDict = { [P in ResourceId]?: NaturalResource };

export function create(options: NaturalResourceOptions): NaturalResource {
	const decay = options.extractRate / (options.naturalCapacity / 2);
	return {
		...options,
		decay,
		abundance: options.naturalCapacity * decay,
		maxAbundance: options.naturalCapacity * decay,
		totalWork: 0,
		totalAmt: 0
	}
}

export function extract(resource: NaturalResource, work: number): NaturalResource {
	const factor = Math.exp(-resource.decay * work);
	const amt = (resource.abundance / resource.decay) * (1.0 - factor);

	var abundance = resource.abundance * factor;
	if ( work < 0 && abundance > resource.maxAbundance ) {
		abundance = resource.maxAbundance;
	}

	return {
		...resource,
		abundance,
		totalWork: resource.totalWork + Math.max(0, work),
		totalAmt: resource.totalAmt + Math.max(0, amt)
	}
}

export function lastExtractedAmt(resource: NaturalResource, prevResource: NaturalResource) {
	return resource.totalAmt - prevResource.totalAmt;
}

export function estimateWorkForAmt(resource: NaturalResource, requestedAmt: number) {
	const amt = Math.min(resource.abundance / resource.decay, requestedAmt),
		factor = 1.0 - (amt / (resource.abundance / resource.decay));

	return Math.log(factor) / -resource.decay;
}
