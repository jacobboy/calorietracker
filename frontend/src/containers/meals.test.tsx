import * as React from 'react';
import * as enzyme from 'enzyme';
import MealsComponent from './meals';
import { mount } from 'enzyme';
import { FOOD_UNIT } from '../classes';
import { AnyAction, createStore, Store } from 'redux';
import { reducer } from '../reducers';
import { Provider } from 'react-redux';
import { Meal, AmountOfNamedMacros } from 'src/client';

function mockMeals(nMeals: number, nFoods: number): Meal[] {
  const meals: Meal[] = [];
  for (let i = 0; i < nMeals; i++) {
      const foods: AmountOfNamedMacros[] = [];
      for (let j = 0; j < nFoods; j++) {
          const food: AmountOfNamedMacros = {
            amount: i * 10 + j,
            namedMacros: {
              uid: 'ingredient_' + i.toString + j.toString(),
              name: 'ingredient_' + i.toString + j.toString(),
              protein: i * 10 + j,
              fat: i * 10 + j,
              carbs: i * 10 + j,
              calories: i * 10 + j,
              amount: i * 10 + j,
              unit: FOOD_UNIT.g,
            }
          };
          foods.push(food);
      }
      meals.push({
        uid: 'meal_' + i.toString(),
        foods
      });
  }
  return meals;
}

describe('When the meals component is selected', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let today: Meal[];
  // tslint:disable-next-line:no-any
  let store: Store<any, AnyAction>;

  const nMeals = 2;
  const nFoods = 2;

  beforeEach(() => {
    today = mockMeals(nMeals, nFoods);
    let state = { today };
    store = createStore(reducer, state);

    wrapper = mount(
      <Provider store={store}>
        <MealsComponent />
      </Provider>
    );
  });

  // TODO make this able to hand if all foods don't have unique UIDs
  for (let iMeal = 0; iMeal < nMeals; iMeal++) {
    for (let iIngred = 0; iIngred < nFoods; iIngred++) {
      it(`should remove ingredient ${iIngred} on meal ${iMeal}`, () => {
        const thisMeal = today[iMeal];
        const foodToRemain = thisMeal.foods[iIngred ? 0 : 1];
        wrapper.find(`#removeFood_${iMeal}_${iIngred}`).simulate('click');
        expect(store.getState().today[iMeal].foods.length).toBe(1);
        expect(store.getState().today[iMeal].foods[0]).toBe(foodToRemain);
      });
    }
  }
});
