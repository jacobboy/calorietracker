import { macrosFromAmountOf } from './transforms';
import { Macros } from './client';

describe('The AmountOf', () => {
  it('scales macros from the base food', () => {
    const macros: Macros = {protein: 1, fat: 2, carbs: 3, calories: 4};
    const from = 50;
    const to = 100;
    const scaledMacros = macrosFromAmountOf(macros, from, to);

    expect(scaledMacros.protein).toBe(2);
    expect(scaledMacros.fat).toBe(4);
    expect(scaledMacros.carbs).toBe(6);
    expect(scaledMacros.calories).toBe(8);
    expect(scaledMacros.proteinPct).toBe(2);
    expect(scaledMacros.fatPct).toBe(4);
    expect(scaledMacros.carbsPct).toBe(6);
  });
});