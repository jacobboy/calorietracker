import * as React from 'react';
import { MealsComponent } from '../components/meals';
import { shallow, ShallowWrapper } from 'enzyme';
import { Meal, meal, Ingredient, makeIngredient, FOOD_UNIT } from 'src/classes';

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
  let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  let mockAddMeal: jest.Mock;
  let mockDeleteMeal: jest.Mock;
  let mockRemoveFood: jest.Mock;
  let today: Meal[];

  beforeEach(() => {
    today = mockMeals(2, 2);
    mockAddMeal = jest.fn();
    mockDeleteMeal = jest.fn();
    mockRemoveFood = jest.fn();

    wrapper = shallow(
      <MealsComponent
        today={today}
        handleAddMealClick={mockAddMeal}
        handleDeleteMealClick={mockDeleteMeal}
        handleRemoveFoodClick={mockRemoveFood}
      />    
      );
    });

  it('should submit the ingredient click', () => {
    wrapper.find('#removeFood').simulate('click');
  });
});