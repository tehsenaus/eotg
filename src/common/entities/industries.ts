
export default {

	// Primary

	grainFarm: {
		natural: {
			water: 1, solar: 10
		},
		input: {
			labour: 1
		},
		capacity: 5,
		output: {
			grain: 10
		}
	},

	logging: extractionProcess('wood'),
	coalMine: extractionProcess('coal'),
	clayQuarry: extractionProcess('clay'),
	limestoneQuarry: extractionProcess('limestone'),
	ironOreQuarry: extractionProcess('ironOre'),
	aluminiumOreQuarry: extractionProcess('aluminiumOre'),
	siliconQuarry: extractionProcess('silicon'),
	copperMine: extractionProcess('copper'),
	oilRig: extractionProcess('oil'),


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

function extractionProcess(name, units?, capacity?) {
	var nat = {}, out = {};
	nat[name] = units || 1;
	out[name] = units || 1;
	return {
		natural: nat,
		input: {
			labour: 1,
		},
		capacity: capacity || 10,
		output: out
	}
}
