import * as React from 'react';
import { MealsComponent } from '../components/meals';
import { mount, ReactWrapper } from 'enzyme';
import { Meal, meal, Ingredient, makeIngredient, FOOD_UNIT, AmountOf } from '../classes';

function mockMeals(nMeals: number, nFoods: number): Meal[] {
    const meals: Meal[] = [];
    for (let i = 0; i < nMeals; i++) {
        const foods: AmountOf<Ingredient>[] = [];
        for (let j = 0; j < nFoods; j++) {
            const food = makeIngredient(
                'ingredient_' + i.toString + j.toString(),
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

describe('When the meals component is selected', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  let mockFoodAmountChange: jest.Mock;
  let mockAddMeal: jest.Mock;
  let mockDeleteMeal: jest.Mock;
  let mockRemoveFood: jest.Mock;
  let today: Meal[];

  const nMeals = 2;
  const nFoods = 2;

  beforeEach(() => {
    today = mockMeals(nMeals, nFoods);
    mockAddMeal = jest.fn();
    mockDeleteMeal = jest.fn();
    mockRemoveFood = jest.fn();

    wrapper = mount(
      <MealsComponent
        today={today}
        handleFoodAmountChange={mockFoodAmountChange}
        handleAddMealClick={mockAddMeal}
        handleDeleteMealClick={mockDeleteMeal}
        handleRemoveFoodClick={mockRemoveFood}
      />
      );
    });

  for (let mealIdx = 0; mealIdx < nMeals; mealIdx++) {
    for (let foodIdx = 0; foodIdx < nMeals; foodIdx++) {
      it(`should submit ingredient ${foodIdx} on meal ${mealIdx}`, () => {
          const foodToRemove = today[mealIdx].foods[foodIdx];
          wrapper.find('#removeFood_' + foodToRemove.uid).simulate('click');
          expect(mockRemoveFood.mock.calls.length).toBe(1);
          expect(mockRemoveFood.mock.calls[0][0]).toBe(mealIdx);
          expect(mockRemoveFood.mock.calls[0][1]).toBe(foodToRemove);
      });
    }
  }
});