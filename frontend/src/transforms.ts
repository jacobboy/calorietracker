import { Macros, AmountOfNamedMacros } from './client';

export function macrosFromAmountOfNamedMacros(amountOfNamedMacros: AmountOfNamedMacros): {
    protein: number, fat: number, carbs: number, calories: number,
    proteinPct: number, fatPct: number, carbsPct: number
  } {
    return macrosFromAmountOf(
      amountOfNamedMacros.namedMacros,
      amountOfNamedMacros.namedMacros.amount,
      amountOfNamedMacros.amount
    );
  }

export function macrosFromAmountOf(macros: Macros, from: number, to: number): {
  protein: number, fat: number, carbs: number, calories: number,
  proteinPct: number, fatPct: number, carbsPct: number
} {
  const percents = macroPercents(macros);
  return {
    protein: scaleQuantity(macros.protein, from, to),
    fat: scaleQuantity(macros.fat, from, to),
    carbs: scaleQuantity(macros.carbs, from, to),
    calories: scaleQuantity(macros.calories, from, to),
    proteinPct: percents.proteinPct,
    fatPct: percents.fatPct,
    carbsPct: percents.carbsPct
  };
}

export function macroPercents(macros: Macros): {
  proteinPct: number, fatPct: number, carbsPct: number
} {
  // use calculated calories because otherwise you can get your math off if
  // declared calories is rounded, or fiber taken into account.  there's a todo for
  // handling fiber.
  const calories = macroCalories(macros);
  return {
    proteinPct: round(macros.protein * 9 / calories, 1),
    fatPct: round(macros.fat * 9 / calories, 1),
    carbsPct: round(macros.carbs * 9 / calories, 1)
  };
}

export function macroCalories(macros: Macros): number {
  return macros.protein * 9 + macros.fat * 4 + macros.carbs * 4;
}

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
