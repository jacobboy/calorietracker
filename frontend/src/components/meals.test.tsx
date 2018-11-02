import * as React from 'react';
import { MealsComponent } from '../components/meals';
import { mount, ReactWrapper } from 'enzyme';
import { Meal, meal, Ingredient, makeIngredient, FOOD_UNIT } from '../classes';

function mockMeals(nMeals: number, nFoods: number): Meal[] {
    const meals: Meal[] = [];
    for (let i = 0; i < nMeals; i++) {
        const foods: Ingredient[] = [];
        for (let j = 0; j < nFoods; j++) {
            const food = makeIngredient(
                'ingredient_' + i.toString + j.toString(),
                i * 10 + j,
                i * 10 + j,
                i * 10 + j,
                i * 10 + j,
                i * 10 + j,
                FOOD_UNIT.g
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

  let mockAddMeal: jest.Mock;
  let mockDeleteMeal: jest.Mock;
  let mockRemoveFood: jest.Mock;
  let today: Meal[];

  beforeEach(() => {
    today = mockMeals(2, 2);
    mockAddMeal = jest.fn();
    mockDeleteMeal = jest.fn();
    mockRemoveFood = jest.fn();

    wrapper = mount(
      <MealsComponent
        today={today}
        handleAddMealClick={mockAddMeal}
        handleDeleteMealClick={mockDeleteMeal}
        handleRemoveFoodClick={mockRemoveFood}
      />    
      );
    });

  it('should submit the ingredient click on the first meal', () => {
      const foodToRemove = today[0].foods[1];
      wrapper.find('#removeFood_' + foodToRemove.uid).simulate('click');
      expect(mockRemoveFood.mock.calls.length).toBe(1);
      expect(mockRemoveFood.mock.calls[0][0]).toBe(1);
      expect(mockRemoveFood.mock.calls[0][1]).toBe(foodToRemove);
    });

  it('should submit the ingredient click on the second meal', () => {
    const foodToRemove = today[1].foods[1];
    wrapper.find('#removeFood_' + foodToRemove.uid).simulate('click');
    expect(mockRemoveFood.mock.calls.length).toBe(1);
    expect(mockRemoveFood.mock.calls[0][0]).toBe(1);
    expect(mockRemoveFood.mock.calls[0][1]).toBe(foodToRemove);
  });
});