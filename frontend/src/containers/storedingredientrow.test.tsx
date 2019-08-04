import * as React from 'react';
import StoredIngredientRow from './storedingredientrow';
import { mount, ReactWrapper } from 'enzyme';
import { createStore, Store, AnyAction } from 'redux';
import { reducer } from '../reducers';
import { Provider } from 'react-redux';
import { FOOD_UNIT } from '../classes';
import { TopBitDisplay, TopBitState, emptyState } from '../types';
import { Meal, NamedMacros, AmountOfNamedMacros } from 'src/client';

// TODO try these with foods already in the meal/recipe

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  // TODO tests work, but how do pros test connected components in typescript?
  let store: {
    getState: () => { topbit: TopBitState, today: Meal[]},
    // tslint:disable-next-line:no-any
    dispatch: any,
    // tslint:disable-next-line:no-any
    subscribe: any,
    // tslint:disable-next-line:no-any
    replaceReducer: any
  };
  let thisMeal: Meal, thatMeal: Meal, thisIngred: NamedMacros, trackFoodId: string;
  let ref: React.RefObject<HTMLElement>;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = {uid: 'foo_uid', name: 'foo', fat, carbs, protein, calories, amount, unit: FOOD_UNIT.g};
    [thisMeal, thatMeal] = [{uid: 'meal1', foods: []}, {uid: 'meal2', foods: []}];
    trackFoodId = `#trackFoodAmountInput_${thisIngred.uid}`;
    /* store = createStore(reducer, {
      topbit: { display: TopBitDisplay.MEALS },
      today: [thisMeal, thatMeal]
    }); */
    store = {
      getState: jest.fn(() => ({ display: TopBitDisplay.MEALS, today: [thisMeal, thatMeal] })),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn()
    };

    ref = {current: {focus: jest.fn()} as unknown as HTMLElement};
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <StoredIngredientRow item={thisIngred} focusRef={ref}/>
        </tbody></table>
      </Provider>
    );
  });

  it(`adds to the meal if it should`, () => {
    const newAmount = 100;
    wrapper.find(trackFoodId).first().simulate(
      'change', { target: { value: newAmount.toString() } }
    );
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');

    const expectedIngred = {namedMacros: thisIngred, amount: newAmount};
    verifyIngredientList(
      store.getState().today[0].foods, [expectedIngred]
    );
  });
  it(`can add to multiple meals`, () => {
    const newAmount2 = 200;
    // TODO using first here because the `id` props causes enzyme
    // to find it twice.  Can I use `ShallowWrapper.dive` instead?
    wrapper.find(trackFoodId).first().simulate(
      'change', { target: { value: newAmount2.toString() } }
    );
    wrapper.find('#trackFoodSubmit_meal2').simulate('click');

    const newAmount1 = 100;
    wrapper.find(trackFoodId).first().simulate(
      'change', { target: { value: newAmount1.toString() } }
    );
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');

    const expectedIngred1 = {namedMacros: thisIngred, amount: newAmount1};
    verifyIngredientList(
      store.getState().today[0].foods, [expectedIngred1]
    );

    const expectedIngred2 = {namedMacros: thisIngred, amount: newAmount2};
    verifyIngredientList(
      store.getState().today[1].foods, [expectedIngred2]
    );
  });
  it('returns focus to provided ref', () => {
    wrapper.find('#trackFoodSubmit_meal2').simulate('click');
    // TODO I know this isn't null, but i'm pretty sure i'm still doing it wrong
    const current = ref.current!;
    expect(current.focus).toHaveBeenCalledTimes(1);
  });
});

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let store: Store<{topbit: TopBitState}, AnyAction>;
  let thisIngred: NamedMacros;
  let ref: React.RefObject<HTMLElement>;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = {uid: 'foo_uid', name: 'foo', fat, carbs, protein, calories, amount, unit: FOOD_UNIT.g};
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
    ref = {current: {focus: jest.fn()} as unknown as HTMLElement};
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <StoredIngredientRow item={thisIngred} focusRef={ref}/>
        </tbody></table>
      </Provider>
    );
  });

  it(`adds to the recipe if it should`, () => {
    const newAmount = 100;
    const trackFoodId = `#trackFoodAmountInput_${thisIngred.uid}`;
    wrapper.find(trackFoodId).last().simulate(
      'change', { target: { value: newAmount.toString() } }
    );
    wrapper.find('#trackFoodSubmit_recipe').simulate('click');

    const expectedIngred = {namedMacros: thisIngred, amount: newAmount};
    expect(store.getState().topbit.recipe.foods.length).toEqual(1);
    verifyIngredientList(store.getState().topbit.recipe.foods, [expectedIngred]);
  });

  it('returns focus to provided ref', () => {
    wrapper.find('#trackFoodSubmit_recipe').simulate('click');
    // TODO I know this isn't null, but i'm pretty sure i'm still doing it wrong
    const current = ref.current!;
    expect(current.focus).toHaveBeenCalledTimes(1);
  });
});

function verifyIngredientList (foods1: AmountOfNamedMacros[], foods2: AmountOfNamedMacros[]) {
  expect(foods1).toEqual(foods2);
  /* const checkAttributes = ['amount', 'namedMacros'];
  expect(foods1.length).toEqual(foods2.length);
  for (let i = 0; i < foods1.length; i++) {
    for (let attr of checkAttributes) {
      expect([attr, i, foods1[i][attr]]).toEqual([attr, i, foods2[i][attr]]);
    }
  } */
}
