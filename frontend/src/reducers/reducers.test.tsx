import { meal, makeIngredient, FOOD_UNIT, Meal } from '../classes';
import { reducer } from '.';
import { actions } from '../actions';
import { StoreState, emptyState } from '../types';

function mockMeals (nMeals: number, nFoods: number) {
  const meals = [];
  for (let i = 0; i < nMeals; i++) {
    const foods = [];
    for (let j = 0; j < nFoods; j++) {
      const food = makeIngredient(
        'ingredient_' + i.toString() + j.toString(),
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        FOOD_UNIT.g,
        false
      );
      foods.push(food);
    }
    meals.push(meal(foods));
  }
  return meals;
}

describe('When food is removed from meal', () => {
  let today: Meal[], state: StoreState;

  const nMeals = 2;
  const nFoods = 2;

  beforeEach(() => {
    today = mockMeals(nMeals, nFoods);
    state = { ...emptyState, today };
  });

  // TODO make this able to hand if all foods don't have unique UIDs
  for (let iMeal = 0; iMeal < nMeals; iMeal++) {
    for (let iIngred = 0; iIngred < nFoods; iIngred++) {
      it(`should remove ingredient ${iIngred} on meal ${iMeal}`, () => {
        const thisMeal = today[iMeal];
        const foodToRemove = thisMeal.foods[iIngred];
        const foodToRemain = thisMeal.foods[iIngred ? 0 : 1];

        state = reducer(state, actions.removeFoodFromMeal(iMeal, foodToRemove));

        expect(state.today[iMeal].foods.length).toBe(1);
        expect(state.today[iMeal].foods[0]).toBe(foodToRemain);
      });
    }
  }
});