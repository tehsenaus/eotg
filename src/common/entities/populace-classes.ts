import { convertToResourceUnit, ResourceDict } from "./resources";

export interface PopulaceClass {
    dailyNeedsPerCapita: {
        life: ResourceDict,
        lifestyle: ResourceDict,
    }    
}

export const POPULACE_CLASSES = {
    unskilled: {
        dailyNeedsPerCapita: {
            life: {
                grain: convertToResourceUnit('grain', 500, 'g'),
            }
        }
    } as PopulaceClass,
    capitalist: {
        dailyNeedsPerCapita: {
            life: {
                grain: convertToResourceUnit('grain', 800, 'g'),
            }
        }
    }
}

export type PopulaceClassId = keyof typeof POPULACE_CLASSES;
