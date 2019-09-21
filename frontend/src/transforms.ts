import { Macros, AmountOfNamedMacros } from 'src/client';

export interface MacrosAndPercents extends Macros {
  proteinPct: number;
  fatPct: number;
  carbsPct: number;
}

export function macrosFromFoods(foods: AmountOfNamedMacros[]): MacrosAndPercents {
  const protein = foods.reduce(
    (l, r) => l + scaleQuantity(r.namedMacros.protein, r.namedMacros.amount, r.amount), 0
  );
  const fat = foods.reduce(
    (l, r) => l + scaleQuantity(r.namedMacros.fat, r.namedMacros.amount, r.amount), 0
  );
  const carbs = foods.reduce(
    (l, r) => l + scaleQuantity(r.namedMacros.carbs, r.namedMacros.amount, r.amount), 0
  );
  const calories = foods.reduce(
    (l, r) => l + scaleQuantity(r.namedMacros.calories, r.namedMacros.amount, r.amount), 0
  );
  return macrosFromAmountOf({fat, carbs, protein, calories}, 1, 1);
}

export function macrosFromAmountOfNamedMacros(
  amountOfNamedMacros: AmountOfNamedMacros
): MacrosAndPercents {
    return macrosFromAmountOf(
      amountOfNamedMacros.namedMacros,
      amountOfNamedMacros.namedMacros.amount,
      amountOfNamedMacros.amount
    );
  }

export function macrosFromAmountOf(macros: Macros, from: number, to: number): MacrosAndPercents {
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
    proteinPct: round(macros.protein * 4 / calories, .01),
    fatPct: round(macros.fat * 9 / calories, .01),
    carbsPct: round(macros.carbs * 4 / calories, .01)
  };
}

export function macroCalories(macros: Macros): number {
  return macros.protein * 4 + macros.fat * 9 + macros.carbs * 4;
}

export function scaleQuantity(q: number, from: number, to: number): number {
  const toPlace = .01;
  const newQ = round(q * to / from, toPlace);
  if (isNaN(newQ)) {
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
