import * as React from 'react';
import * as enzyme from 'enzyme';
import { Provider } from 'react-redux';
import CreateIngredientInput from './createingredientinput';
import { mount } from 'enzyme';
import { FOOD_UNIT } from 'src/classes';
import { CREATE_INGREDIENT_SUBMIT } from 'src/constants';
import { macrosFromAmountOf } from 'src/transforms';
import { createStore, Store } from 'redux';

describe('When ingredient create button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;

  // tslint:disable-next-line:no-any
  let store: Store<{}, any>;
  // tslint:disable-next-line:no-any
  let createdActions: any[];

  beforeEach(() => {
    createdActions = [];
    store = createStore(
      (state, actions) => { createdActions.push(actions); return state; },
      {}
    );

    wrapper = mount(
      <Provider store={store}>
        <CreateIngredientInput />
      </Provider>
    );
  });

  it(`creates the ingredient appropriately with default 100 grams`, () => {

    // TODO will this affect other tests?
    let [name, fat, carbs, protein, calories, amount] = ['foo', 1, 2, 3, 4, 100];

    wrapper.find('#nameInput').simulate('change', { target: { value: name } });
    wrapper.find('#fatInput').simulate('change', { target: { value: fat } });
    wrapper.find('#carbsInput').simulate('change', { target: { value: carbs } });
    wrapper.find('#proteinInput').simulate('change', { target: { value: protein } });
    wrapper.find('#caloriesInput').simulate('change', { target: { value: calories } });
    wrapper.find('#createIngredientAmountInput').simulate('change', { target: { value: amount } });
    // wrapper.find('#createIngredientConvertAmountInput').simulate('change', { target: { value: amount } });
    wrapper.find('#submitIngredient').simulate('submit');

    const expectedFood = {
      name,
      fat,
      carbs,
      protein,
      calories,
      amount,
      unit: FOOD_UNIT.g
    };
    expect(createdActions).toContainEqual({'payload': expectedFood, 'type': CREATE_INGREDIENT_SUBMIT});
  });

  it(`scales the ingredient appropriately`, () => {
    let [name, fat, carbs, protein, calories, amount, convertAmount] = ['foo', 1, 2, 3, 4, 5, 1];

    wrapper.find('#nameInput').simulate('change', { target: { value: name } });
    wrapper.find('#fatInput').simulate('change', { target: { value: fat } });
    wrapper.find('#carbsInput').simulate('change', { target: { value: carbs } });
    wrapper.find('#proteinInput').simulate('change', { target: { value: protein } });
    wrapper.find('#caloriesInput').simulate('change', { target: { value: calories } });
    wrapper.find('#createIngredientAmountInput').simulate('change', { target: { value: amount } });
    wrapper.find('#createIngredientConvertAmountInput').simulate('change', { target: { value: convertAmount } });
    wrapper.find('#submitIngredient').simulate('submit');

    const scaledMacros = macrosFromAmountOf({protein, fat, carbs, calories}, amount, convertAmount);
    const expectedFood = {
      name,
      protein: scaledMacros.protein,
      fat: scaledMacros.fat,
      carbs: scaledMacros.carbs,
      calories: scaledMacros.calories,
      amount: convertAmount,
      unit: FOOD_UNIT.g
    };

    expect(createdActions).toContainEqual({'payload': expectedFood, 'type': CREATE_INGREDIENT_SUBMIT});
  });
});