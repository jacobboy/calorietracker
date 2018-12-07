import * as React from 'react';
import { shallow } from 'enzyme';
import { StoredIngredientRow } from './storedingredientrow';
import { makeIngredient, FOOD_UNIT } from '../classes';
import { TopBitDisplay } from '../types';

it('Passes the MealInput the input amount when no scaling has happened', () => {
  let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5];
  const thisIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false);
  const wrapper = shallow(
    <StoredIngredientRow
      item={thisIngred}
      topbitDisplay={TopBitDisplay.MEALS}
      foodComboNames={[]}
      onTrackClick={() => undefined}
      focusRef={React.createRef()}
    />
  );
  // tslint:disable-next-line:no-string-literal
  expect(wrapper.find(`#trackFoodAmountInput_${thisIngred.uid}`).props()['amount']).toBe('5');
});
