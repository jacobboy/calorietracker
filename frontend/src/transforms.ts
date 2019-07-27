import { AmountOfNamedMacros, Macros } from './client';

export function scaleQuantity(q: number, from: number, to: number): number {
  const toPlace = .01;
  const newQ = round(q * to / from, toPlace);
  if (isNaN(newQ)) {
    // console.log(`Scale quantity received ${[q, from, to]}, returning 0`);
    return 0;
  }
  return newQ;
}

export function round(value: number, toPlace: number) {
  if (value) {
    const multiplier = 1 / toPlace;
    return Math.round(value * multiplier) / multiplier;
  } else {
    return 0.0;
  }
}

export function macrosFromAmount(food: AmountOfNamedMacros): Macros {
  return {
    protein: scaleQuantity(food.namedMacros.protein, food.namedMacros.amount, food.amount),
    fat: scaleQuantity(food.namedMacros.fat, food.namedMacros.amount, food.amount),
    carbs: scaleQuantity(food.namedMacros.carbs, food.namedMacros.amount, food.amount),
    calories: scaleQuantity(food.namedMacros.calories, food.namedMacros.amount, food.amount),
  };
}