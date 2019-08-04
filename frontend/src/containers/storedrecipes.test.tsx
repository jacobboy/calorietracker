import { ReactWrapper, mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, AnyAction, createStore } from 'redux';
import { FOOD_UNIT, makeTestNamedMacros, makeTestRecipe } from '../classes';
import StoredRecipes from '../containers/storedrecipes';
import { reducer } from '../reducers';
import { TopBitDisplay } from '../types';
import { AmountOfNamedMacros, Recipe } from 'src/client';

function mockIngredients(nFoods: number) {
  const foods = [];
  for (let i = 0; i < nFoods; i++) {
    const food = {
      amount: i + 5,
      namedMacros: makeTestNamedMacros(
        'ingredient_' + i.toString(),
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        FOOD_UNIT.g
      )
    };

    foods.push(food);
  }
  return foods;
}

describe('The stored ingredient component', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  // tslint:disable-next-line:no-any
  let store: Store<any, AnyAction>;

  let foods: AmountOfNamedMacros[];
  let recipe: Recipe;

  beforeEach(() => {
    foods = mockIngredients(2);
    recipe = makeTestRecipe('Test Recipe 2', foods, 100);

    let state = {
      topbit: {
        display: TopBitDisplay.CREATE_RECIPE,
        recipe: {
          foods: []
        }
      },
      saved: {
        recipes: [
          makeTestRecipe('Test Recipe 1', [foods[1]], 12), // just to have more than one
          recipe
        ]
      }
    };
    store = createStore(reducer, state);

    wrapper = mount(
      <Provider store={store}>
        <StoredRecipes searchText={'2'} focusRef={React.createRef()} />
      </Provider>
    );

  });
  it('adds recipes to the state on add recipe click', () => {
    const mockLoadRecipe = jest.fn();
    mockLoadRecipe.mockReturnValue(JSON.stringify(recipe));
    window.localStorage.getItem = mockLoadRecipe;
    wrapper.find(`#copy_${recipe.uid}`).simulate('click');
    expect(store.getState().topbit.recipe.foods).toEqual(recipe.foods);
  });
  it('only displays recipes that match the search criteria', () => {
    expect(wrapper.html().indexOf('Test Recipe 2')).toBeGreaterThan(-1);
    expect(wrapper.html().indexOf('Test Recipe 1')).toEqual(-1);
  });
});
