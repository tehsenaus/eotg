import { mergeWith } from "lodash";

export function updateExponentialMovingAvg(smoothingFactor: number, lastValue: number, value: number): number {
    if (lastValue === undefined) {
        return value;
    }
    return smoothingFactor * value + (1 - smoothingFactor) * lastValue;
}

export function updateExponentialMovingAvgDict(smoothingFactor: number, lastValues, values) {
    return mergeWith(
        lastValues,
        values,
        (lastValue, value) => updateExponentialMovingAvg(smoothingFactor, lastValue, value)
    );
}
