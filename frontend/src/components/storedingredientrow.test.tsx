import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { StoredIngredientRow } from './storedingredientrow';
import { makeIngredient, FOOD_UNIT, Ingredient } from '../classes';
import { TopBitDisplay } from '../types';
import { MathInput } from './mathinput';

describe('The StoredIngredientComponent', () => {
  const foodComboName = 'meal1';
  let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
  let thisIngred: Ingredient;
  let mockTrackFn: jest.Mock<{}>;
  let wrapper: ShallowWrapper;
  beforeEach(() => {
    thisIngred = makeIngredient(
      'foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false
    ).baseFood;
    mockTrackFn = jest.fn();
    wrapper = shallow(
      <StoredIngredientRow
        item={thisIngred}
        topbitDisplay={TopBitDisplay.MEALS}
        foodComboNames={[foodComboName]}
        onTrackClick={mockTrackFn}
        focusRef={React.createRef()}
      />
    );

  });
  it('Passes the MealInput the input amount when no scaling has happened', () => {
    expect(wrapper.find(MathInput).props().amount).toBe('5');
  });

  // how do i get a handle on a specific component
  it('Resets the state after track click', () => {
    // tslint:disable-next-line:no-string-literal
    const originalIngred = wrapper.state()['scaledIngredient'];
    wrapper.find(`#trackFoodAmountForm_${thisIngred.uid}`).simulate('submit');
    // tslint:disable-next-line:no-string-literal
    expect(wrapper.state()['scaledIngredient']).not.toBe(originalIngred);
  });

  it('Resets the state after tracking to a specific meal', () => {
    // tslint:disable-next-line:no-string-literal
    const originalIngred = wrapper.state()['scaledIngredient'];
    wrapper.find(`#trackFoodSubmit_${foodComboName}`).simulate('click');
    // tslint:disable-next-line:no-string-literal
    expect(wrapper.state()['scaledIngredient']).not.toBe(originalIngred);
  });

  it('Calls the track handler with the appropriate amount', () => {
    const newAmount = 100;
    wrapper.find(MathInput).props().onChange(100);
    wrapper.find(`#trackFoodAmountForm_${thisIngred.uid}`).simulate('submit');
    // TODO why does VSCode hate toBeCalledTimes
    // expect(mockTrackFn).toBeCalledTimes(1);
    // tslint:disable-next-line:no-string-literal
    expect(mockTrackFn.mock.calls[0][0]['amount']).toBe(newAmount);
    // tslint:disable-next-line:no-string-literal
    expect(mockTrackFn.mock.calls[0][0]['baseFood']).toBe(thisIngred);
  });
});
