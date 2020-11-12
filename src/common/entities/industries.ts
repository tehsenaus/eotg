
import { convertToResourceUnit, ResourceDict, ResourceId } from "./resources";

export interface IndustrialProcess {
	id: string;
	// type: IndustrialProcessType;
	naturalResources: ResourceDict;
	input: ResourceDict;
	output: ResourceDict;
}

export const INDUSTRIES = {

	// Primary

	grainFarm: {
		// https://science.howstuffworks.com/environmental/green-science/question638.htm
		naturalResources: {
			water: 1,
			solar: 10,
			// land: convertToResourceUnit('land', 1, 'ac')
		},
		input: {
			// https://www.nationmaster.com/country-info/stats/Agriculture/Workers-per-hectare
			// Assume 2 per acre (low-tech farming)
			unskilledLabour: 2,
		},
		capacity: 5,
		output: {
			grain: convertToResourceUnit('grain', 3 / 365, 't') // (3t / acre / year)
		}
	},

	meatFarm: {
		naturalResources: {
			water: 10,
		},
		input: {
			labour: 1
		},
		capacity: 5,
		output: {
			meat: 1
		}
	},

	logging: extractionProcess('wood'),
	// coalMine: extractionProcess('coal'),
	// clayQuarry: extractionProcess('clay'),
	// limestoneQuarry: extractionProcess('limestone'),
	// ironOreQuarry: extractionProcess('ironOre'),
	// aluminiumOreQuarry: extractionProcess('aluminiumOre'),
	// siliconQuarry: extractionProcess('silicon'),
	// copperMine: extractionProcess('copper'),
	// oilRig: extractionProcess('oil'),


	// Refining

	oilRefinery: {
		input: {
			labour: 1,
			oil: 1
		},
		capacity: 100,
		output: {
			plastics: 1
		}
	},
	ironFurnace: {
		input: {
			labour: 1,
			ironOre: 1,
			coal: 1
		},
		capacity: 50,
		output: {
			iron: 1
		}
	},

	// Secondary

	coalPower: {
		input: {
			labour: 1,
			coal: 10
		},
		capacity: 100,
		output: {
			electricity: 15
		}
	},



	goodsFactory: {
		input: {
			labour: 2,
			plastics: 1
		},
		output: {
			luxuries: 1
		}
	}
};

export default INDUSTRIES;

function extractionProcess(name: ResourceId, units?): IndustrialProcess {
	const nat = {}, out = {};
	nat[name] = units || 1;
	out[name] = units || 1;
	return {
		id: name,
		naturalResources: nat,
		input: {
			unskilledLabour: 1,
		},
		output: out
	}
}
