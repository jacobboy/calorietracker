import * as React from 'react';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { makeIngredient, FOOD_UNIT, Ingredient, Recipe, makeRecipe } from '../classes';
import { AnyAction, createStore, Store } from 'redux';
import { reducer } from '../reducers';
import CreateRecipeInput from '../containers/createrecipe';
import { TopBitState, emptyState } from '../types';

function mockIngredients(nFoods: number) {
  const foods = [];
  for (let i = 0; i < nFoods; i++) {
    const food = makeIngredient(
      'ingredient_' + i.toString(),
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      FOOD_UNIT.g,
      false
    );
    foods.push(food);
  }
  return foods;
}

describe('Recipes', () => {
  const nFoods = 2;

  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let foods: Ingredient[];
  let store: Store<{topbit: TopBitState, saved: {recipes: Recipe[]}}, AnyAction>;

  beforeEach(() => {
    foods = mockIngredients(nFoods);
    let state = {
      topbit: { ...emptyState.topbit, recipe: { ...emptyState.topbit.recipe, foods } },
      saved: { recipes: [] }
    };
    store = createStore(reducer, state);

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
      wrapper.find('#removeFood_' + foodToRemove.uid).simulate('click');
      expect(store.getState().topbit.recipe.foods.length).toBe(1);
      expect(store.getState().topbit.recipe.foods[0]).toBe(foodToRemain);
    });
  }

  it('can be created', () => {
    const title = 'My Bitchin\' Recipe';
    const portionSize = 100;
    const totalSize = 101;
    const unit = FOOD_UNIT.g;
    const createdRecipe = makeRecipe(title, foods, portionSize, totalSize, unit);

    wrapper.find('#recipeAmountInput').simulate('change', {target: { value: totalSize }});
    wrapper.find('#recipeUnitInput').simulate('change', {target: { value: unit }});
    wrapper.find('#saveRecipe').simulate('click');

    expect(store.getState().topbit.recipe.foods.length).toBe(0);
    expect(store.getState().saved.recipes.length).toBe(1);

    const foundRecipe = store.getState().saved.recipes[0];
    expect(foundRecipe.foods.length).toBe(nFoods);

    expect(foundRecipe.name).toEqual(createdRecipe.name);
    expect(foundRecipe.fat).toEqual(createdRecipe.fat);
    expect(foundRecipe.carbs).toEqual(createdRecipe.carbs);
    expect(foundRecipe.protein).toEqual(createdRecipe.protein);
    expect(foundRecipe.calories).toEqual(createdRecipe.calories);
    expect(foundRecipe.amount).toEqual(createdRecipe.amount);
    expect(foundRecipe.amount).toBe(createdRecipe.amount);
    expect(foundRecipe.unit).toBe(createdRecipe.unit);

    for (let i = 0; i < foundRecipe.foods.length; i++) {
      let foundFood = foundRecipe.foods[i];
      let expectedFood = createdRecipe.foods[i];
      expect(foundFood.name).toEqual(expectedFood.name);
      expect(foundFood.fat).toEqual(expectedFood.fat);
      expect(foundFood.carbs).toEqual(expectedFood.carbs);
      expect(foundFood.protein).toEqual(expectedFood.protein);
      expect(foundFood.calories).toEqual(expectedFood.calories);
      expect(foundFood.amount).toEqual(expectedFood.amount);
    }
  });
});
