import { makeIngredient, FOOD_UNIT, amountOf } from './classes';

describe('The AmountOf', () => {
  it('scales macros from the base food', () => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    let convertAmount = 100;
    const ingred = makeIngredient(
      'foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false
    );
    const amountOfIngred = amountOf(ingred, convertAmount);
    expect(amountOfIngred.fat).toBe(fat * 20);
  });
});