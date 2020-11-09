import { ResourceDict } from "./resources";

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
                grain: 0.01,
            }
        }
    } as PopulaceClass
}

export type PopulaceClassId = keyof typeof POPULACE_CLASSES;
