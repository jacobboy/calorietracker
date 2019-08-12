import * as React from 'react';
import StoredIngredientRow from './storedingredientrow';
import { mount, ReactWrapper } from 'enzyme';
import { createStore, Store, AnyAction } from 'redux';
import { reducer } from '../reducers';
import { Provider } from 'react-redux';
import { FOOD_UNIT } from '../classes';
import { TopBitDisplay, TopBitState, emptyState } from '../types';
import { Meal, NamedMacros, AmountOfNamedMacros } from 'src/client';
import { actions } from 'src/actions';

// TODO try these with foods already in the meal/recipe

describe('When the track food button is clicked on meals view', () => {
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
  let dispatch: () => null;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = {uid: 'foo_uid', name: 'foo', fat, carbs, protein, calories, amount, unit: FOOD_UNIT.g};
    [thisMeal, thatMeal] = [{uid: 'meal1', foods: []}, {uid: 'meal2', foods: []}];
    trackFoodId = `#trackFoodAmountInput_${thisIngred.uid}`;
    dispatch = jest.fn();

    store = {
      getState: () => ({
        topbit: { ...emptyState.topbit, display: TopBitDisplay.MEALS },
        today: [thisMeal, thatMeal]
      }),
      dispatch,
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
    wrapper.find('#trackFoodSubmit_meal0').simulate('click');

    const expectedIngred = {namedMacros: thisIngred, amount: newAmount};
    expect(dispatch).toHaveBeenCalledWith(actions.addFoodToMeal(expectedIngred, 0));
  });
  it(`can add to multiple meals`, () => {
    const newAmount1 = 100;
    const newAmount2 = 200;

    // TODO using first here because the `id` props causes enzyme
    // to find it twice.  Can I use `ShallowWrapper.dive` instead?
    wrapper.find(trackFoodId).first().simulate(
      'change', { target: { value: newAmount1.toString() } }
    );
    wrapper.find('#trackFoodSubmit_meal0').simulate('click');

    wrapper.find(trackFoodId).first().simulate(
      'change', { target: { value: newAmount2.toString() } }
    );
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');

    const expectedIngred1 = {namedMacros: thisIngred, amount: newAmount1};
    expect(dispatch).toHaveBeenCalledWith(actions.addFoodToMeal(expectedIngred1, 0));

    const expectedIngred2 = {namedMacros: thisIngred, amount: newAmount2};
    expect(dispatch).toHaveBeenCalledWith(actions.addFoodToMeal(expectedIngred2, 1));
  });
  it('returns focus to provided ref', () => {
    wrapper.find('#trackFoodSubmit_meal1').simulate('click');
    // TODO I know this isn't null, but i'm pretty sure i'm still doing it wrong
    const current = ref.current!;
    expect(current.focus).toHaveBeenCalledTimes(1);
  });
});

describe('When the track food button is clicked on create recipe view', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  // TODO tests work, but how do pros test connected components in typescript?
  let store: {
    getState: () => { topbit: TopBitState},
    // tslint:disable-next-line:no-any
    dispatch: any,
    // tslint:disable-next-line:no-any
    subscribe: any,
    // tslint:disable-next-line:no-any
    replaceReducer: any
  };
  let dispatch: () => null;
  let ref: React.RefObject<HTMLElement>;
  let thisIngred: NamedMacros;

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
    thisIngred = {uid: 'foo_uid', name: 'foo', fat, carbs, protein, calories, amount, unit: FOOD_UNIT.g};
    dispatch = jest.fn();
    store = {
      getState: () => ({
        topbit: {
          ...emptyState.topbit,
          display: TopBitDisplay.CREATE_RECIPE,
          recipe: {
            ...emptyState.topbit.recipe,
            foods: []
          }
        }
      }),
      dispatch,
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

  it(`adds to the recipe if it should`, () => {
    const newAmount = 100;
    const trackFoodId = `#trackFoodAmountInput_${thisIngred.uid}`;
    wrapper.find(trackFoodId).last().simulate(
      'change', { target: { value: newAmount.toString() } }
    );
    wrapper.find('#trackFoodSubmit_recipe').simulate('click');

    const expectedIngred = {namedMacros: thisIngred, amount: newAmount};
    expect(dispatch).toHaveBeenCalledWith(actions.addFoodToRecipe(expectedIngred));
  });

  it('returns focus to provided ref', () => {
    wrapper.find('#trackFoodSubmit_recipe').simulate('click');
    // TODO I know this isn't null, but i'm pretty sure i'm still doing it wrong
    const current = ref.current!;
    expect(current.focus).toHaveBeenCalledTimes(1);
  });
});
