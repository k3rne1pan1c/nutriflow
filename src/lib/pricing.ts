import type { PriceUnit, Unit } from '$lib/types';

/** Suggest a sensible "per …" unit when the user adds a local price. */
export function defaultPriceUnit(amountUnit: Unit): PriceUnit {
	if (amountUnit === 'pcs' || amountUnit === 'clove') return 'pcs';
	if (amountUnit === 'ml' || amountUnit === 'l') return 'l';
	return 'kg';
}

export function priceUnitLabel(unit: PriceUnit): string {
	if (unit === 'kg') return 'per kg';
	if (unit === 'l') return 'per liter';
	return 'per piece';
}

/** Convert a shopping-list amount into the base used for the user's price unit. */
function amountInPriceBase(amount: number, amountUnit: Unit, priceUnit: PriceUnit): number | null {
	if (priceUnit === 'pcs') {
		if (amountUnit === 'pcs' || amountUnit === 'clove') return amount;
		return null;
	}
	if (priceUnit === 'kg') {
		if (amountUnit === 'kg') return amount;
		if (amountUnit === 'g') return amount / 1000;
		return null;
	}
	if (priceUnit === 'l') {
		if (amountUnit === 'l') return amount;
		if (amountUnit === 'ml') return amount / 1000;
		return null;
	}
	return null;
}

/** Line cost from optional user price; returns null when units cannot be converted. */
export function calculateLineCost(
	amount: number,
	amountUnit: Unit,
	price: number,
	priceUnit: PriceUnit
): number | null {
	const base = amountInPriceBase(amount, amountUnit, priceUnit);
	if (base === null) return null;
	return +(base * price).toFixed(2);
}
