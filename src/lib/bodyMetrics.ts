import type { Sex } from '$lib/types';

export type WeightDirection = 'lose' | 'gain' | 'maintain';

export interface TargetWeightRecommendation {
	recommended: number;
	bmi: number;
	healthyMin: number;
	healthyMax: number;
	message: string;
	direction: WeightDirection;
}

function roundKg(value: number) {
	return Math.round(value * 10) / 10;
}

/**
 * Suggest a target weight from height and current weight using BMI.
 * Aims for gradual, sustainable change — not aggressive dieting.
 */
export function recommendTargetWeight(
	heightCm: number | null,
	weightKg: number | null,
	sex?: Sex | null
): TargetWeightRecommendation | null {
	if (!heightCm || !weightKg || heightCm < 100 || heightCm > 250 || weightKg < 30 || weightKg > 300) {
		return null;
	}

	const heightM = heightCm / 100;
	const bmi = weightKg / (heightM * heightM);
	const healthyMin = 18.5 * heightM * heightM;
	const healthyMax = 24.9 * heightM * heightM;
	const idealBmi = sex === 'Male' ? 22.5 : sex === 'Female' ? 21.5 : 22;
	const idealWeight = idealBmi * heightM * heightM;

	let recommended: number;
	let message: string;
	let direction: WeightDirection;

	if (bmi < 18.5) {
		direction = 'gain';
		recommended = roundKg(Math.min(idealWeight, healthyMin + 2));
		message = `Your BMI is ${bmi.toFixed(1)} — below the healthy range. Building toward ${recommended} kg supports better energy and recovery.`;
	} else if (bmi > 24.9) {
		direction = 'lose';
		const gradualTarget = Math.max(idealWeight, weightKg * 0.92);
		recommended = roundKg(Math.max(healthyMin, Math.min(gradualTarget, weightKg - 2)));
		message = `Your BMI is ${bmi.toFixed(1)}. A gradual target of ${recommended} kg moves you toward a healthier range without drastic cuts.`;
	} else {
		direction = 'maintain';
		recommended = roundKg(weightKg);
		message = `Your BMI is ${bmi.toFixed(1)} — already in a healthy range. Staying around ${recommended} kg is a solid goal.`;
	}

	return {
		recommended,
		bmi: roundKg(bmi),
		healthyMin: roundKg(healthyMin),
		healthyMax: roundKg(healthyMax),
		message,
		direction
	};
}
