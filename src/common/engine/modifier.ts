
export interface Modifier<T> {
	id: string;
	valueAccessor(state: T): number;
}

export function applyModifiers<T>(state: T, modifiers: Modifier<T> []): number {
	return modifiers.reduce(
		(value, modifier) => value + modifier.valueAccessor(state),
		0,
	);
}
