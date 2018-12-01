import * as React from 'react';
import * as enzyme from 'enzyme';
import StoredIngredientRow from './storedingredientrow';
import { mount } from 'enzyme';
import { createStore, Store, AnyAction } from 'redux';
import { reducer } from '../reducers';
import { Provider } from 'react-redux';
import { FOOD_UNIT, makeIngredient, meal, scaleFoodTo, Ingredient, Meal } from '../classes';
import { TopBitDisplay, TopBitState, emptyState } from '../types';

// TODO try these with foods already in the meal/recipe

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let store: Store<{topbit: TopBitState, today: Meal[]}, AnyAction>;
  let thisMeal: Meal, thatMeal: Meal, thisIngred: Ingredient;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false);
    [thisMeal, thatMeal] = [meal([]), meal([])];
    store = createStore(reducer, {
      topbit: { display: TopBitDisplay.MEALS },
      today: [thisMeal, thatMeal]
    });
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <StoredIngredientRow item={thisIngred} />
        </tbody></table>
      </Provider>
    );
  });

  it(`adds to the meal if it should`, () => {
    const newAmount = 100;
    wrapper.find('#trackFoodAmountInput').simulate(
      'change', { target: { value: newAmount } }
    );
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');

    const expectedIngred = scaleFoodTo(thisIngred, newAmount);
    verifyIngredientList(
      store.getState().today[0].foods, [expectedIngred]
    );
  });
  it(`can add to multiple meals`, () => {
    const newAmount2 = 200;
    wrapper.find('#trackFoodAmountInput').simulate(
      'change', { target: { value: newAmount2 } }
    );
    wrapper.find('#trackFoodSubmit_meal2').simulate('click');

    const newAmount1 = 100;
    wrapper.find('#trackFoodAmountInput').simulate(
      'change', { target: { value: newAmount1 } }
    );
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');

    const expectedIngred1 = scaleFoodTo(thisIngred, newAmount1);
    verifyIngredientList(
      store.getState().today[0].foods, [expectedIngred1]
    );

    const expectedIngred2 = scaleFoodTo(thisIngred, newAmount2);
    verifyIngredientList(
      store.getState().today[1].foods, [expectedIngred2]
    );
  });
});

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let store: Store<{topbit: TopBitState}, AnyAction>;
  let thisIngred: Ingredient;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false);
    store = createStore(reducer, {
      topbit: {
        ...emptyState.topbit,
        display: TopBitDisplay.CREATE_RECIPE,
        recipe: {
          ...emptyState.topbit.recipe,
          foods: []
        }
      }
    });
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <StoredIngredientRow item={thisIngred} />
        </tbody></table>
      </Provider>
    );
  });

  it(`adds to the recipe if it should`, () => {
    const newAmount = 100;
    wrapper.find('#trackFoodAmountInput').simulate(
      'change', { target: { value: newAmount } }
    );
    wrapper.find('#trackFoodSubmit_recipe').simulate('click');

    const expectedIngred = scaleFoodTo(thisIngred, newAmount);
    expect(store.getState().topbit.recipe.foods.length).toEqual(1);
    verifyIngredientList(store.getState().topbit.recipe.foods, [expectedIngred]);
  });
});

function verifyIngredientList (foods1: Ingredient[], foods2: Ingredient[]) {
  const checkAttributes = ['name', 'amount', 'fat', 'carbs', 'protein', 'calories'];
  expect(foods1.length).toEqual(foods2.length);
  for (let i = 0; i < foods1.length; i++) {
    for (let attr of checkAttributes) {
      expect([attr, i, foods1[i][attr]]).toEqual([attr, i, foods2[i][attr]]);
    }
  }
}
