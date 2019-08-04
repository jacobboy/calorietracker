import * as React from 'react';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { FOOD_UNIT } from '../classes';
import CreateRecipeInput from '../containers/createrecipe';
import { TopBitState, emptyState } from '../types';
import { AmountOfNamedMacros, Recipe } from 'src/client';
import { scaleQuantity } from 'src/transforms';
import { CREATE_RECIPE_SUBMIT } from 'src/constants';
import { actions } from 'src/actions';

function mockIngredients(nFoods: number) {
  const foods = [];
  for (let i = 0; i < nFoods; i++) {
    const food = {
      amount: 100,
      namedMacros: {
        name: 'ingredient_' + i.toString(),
        uid: 'ingredient_' + i.toString(),
        protein: i + 1,
        fat: i + 2,
        carbs: i + 3,
        calories: i + 4,
        amount: i + 5,
        unit: FOOD_UNIT.g
      }
    };
    foods.push(food);
  }
  return foods;
}

describe('Recipes', () => {
  const nFoods = 2;

  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let foods: AmountOfNamedMacros[];
  // TODO tests work, but how do pros test connected components in typescript?
  let store: {
    getState: () => { topbit: TopBitState, saved: { recipes: Recipe[] } },
    // tslint:disable-next-line:no-any
    dispatch: any,
    // tslint:disable-next-line:no-any
    subscribe: any,
    // tslint:disable-next-line:no-any
    replaceReducer: any
  };
  /* let store: Store<{topbit: TopBitState, saved: {recipes: Recipe[]}}, AnyAction>; */

  beforeEach(() => {
    foods = mockIngredients(nFoods);
    /* let state = {
      topbit: { ...emptyState.topbit, recipe: { ...emptyState.topbit.recipe, foods } },
      saved: { recipes: [] }
    }; */
    /* store = createStore(reducer, state); */
    store = {
      getState: jest.fn(() => ({ ...emptyState.topbit, recipe: { ...emptyState.topbit.recipe, foods } })),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn()
    };

    wrapper = mount(
      <Provider store={store}>
        <CreateRecipeInput />
      </Provider>
    );
  });

  for (let iIngred = 0; iIngred < nFoods; iIngred++) {
    it(`can have food ${iIngred} removed`, () => {
      const foodToRemove = foods[iIngred];
      const foodToRemain = foods[iIngred ? 0 : 1];
      wrapper.find(`#removeFood_1_${iIngred}`).simulate('click');
      expect(store.getState().topbit.recipe.foods.length).toBe(1);
      expect(store.getState().topbit.recipe.foods[0]).toBe(foodToRemain);
    });
  }

  function macroSum(macroName: string) {
    return foods.reduce(
      (macro, food) => macro + scaleQuantity(food.namedMacros[macroName], food.namedMacros.amount, food.amount),
      0
    );
  }

  it('can sum and display portions', () => {
    const portionSize = 300;
    const amount = 101;
    const portionMultiplier = portionSize / amount;

    wrapper.find('#recipePortionInput').simulate('change', { target: { value: portionSize } });
    wrapper.find('#recipeAmountInput').simulate('change', { target: { value: amount } });

    const protein = macroSum('protein') * portionMultiplier;
    const fat = macroSum('fat') * portionMultiplier;
    const carbs = macroSum('carbs') * portionMultiplier;
    const calories = macroSum('calories') * portionMultiplier;

    expect(wrapper.find('#portionProtein').text()).toEqual(protein.toFixed());
    expect(wrapper.find('#portionFat').text()).toEqual(fat.toFixed());
    expect(wrapper.find('#portionCarbs').text()).toEqual(carbs.toFixed());
    expect(wrapper.find('#portionCalories').text()).toEqual(calories.toFixed());
  });

  it('dispatches CREATE_RECIPE on create', () => {
    const title = 'The Recipe';
    const portionSize = 300;
    const totalSize = 101;
    const unit = FOOD_UNIT.g;

    wrapper.find('#recipeNameInput').simulate('change', { target: { value: title } });
    wrapper.find('#recipePortionInput').simulate('change', { target: { value: portionSize } });
    wrapper.find('#recipeAmountInput').simulate('change', { target: { value: totalSize } });
    wrapper.find('#recipeUnitInput').simulate('change', { target: { value: unit } });
    wrapper.find('#saveRecipe').simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(
      {
        type: CREATE_RECIPE_SUBMIT,
        action: actions.saveRecipe(name, foods, portionSize, totalSize, unit)
      }
    );
  });

  it('can edit ingredient amounts before saving', () => {
    const title = 'The Recipe';
    const portionSize = 50;
    const totalSize = 100;
    const unit = FOOD_UNIT.g;
    const foodToChangeIdx = 1;
    const newFood = {...foods[foodToChangeIdx], amount: foods[foodToChangeIdx].amount * 5};

    wrapper.find('#recipeNameInput').simulate('change', { target: { value: title } });
    wrapper.find('#recipePortionInput').simulate('change', { target: { value: portionSize } });
    wrapper.find('#recipeAmountInput').simulate('change', { target: { value: totalSize } });
    wrapper.find('#recipeUnitInput').simulate('change', { target: { value: unit } });
    wrapper.find('#saveRecipe').simulate('click');
    wrapper.find(`#foodAmountInput_1_1}`).first().simulate(
      'change', { target: { value: newFood.amount.toString() } }
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      {
        type: CREATE_RECIPE_SUBMIT,
        action: actions.saveRecipe(name, [foods[0], foods[foodToChangeIdx]], portionSize, totalSize, unit)
      }
    );
  });
});