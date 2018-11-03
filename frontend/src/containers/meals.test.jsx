import * as React from 'react'
import { MealsComponent } from '../containers/meals'
import { mount } from 'enzyme'
import { meal, makeIngredient, FOOD_UNIT } from '../classes'
import { createStore } from 'redux'
import { reducer } from 'src/reducers'
import { Provider } from 'react-redux'

function mockMeals (nMeals, nFoods) {
    const meals = [];
    for (let i = 0; i < nMeals; i++) {
        const foods = [];
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
  let wrapper;

  let mockAddMeal;
  let mockDeleteMeal;
  let mockRemoveFood;
  let today;
  let store;

  const nMeals = 2;
  const nFoods = 2;

  beforeEach(() => {
    today = mockMeals(nMeals, nFoods);
    let state = { today };
    store = createStore(reducer, initialState);

    wrapper = mount(
      <Provider store={store}>
        <MealsComponent />    
      </Provider>
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
