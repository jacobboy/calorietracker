import * as React from 'react';
import { TopBitComponent } from '../components/topbit';
import { TopBitDisplay } from '../types';
import { shallow, ShallowWrapper } from 'enzyme';

describe('When the meals component is selected', () => {
  // tslint:disable-next-line:no-any  
  let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let mockIngedientToggle: jest.Mock;
  beforeEach(() => {
    mockIngedientToggle = jest.fn();
    wrapper = shallow(
      <TopBitComponent 
        display={TopBitDisplay.MEALS}
        onIngredientToggle={mockIngedientToggle}
      />    
      );
    });

  it('should submit the ingredient click', () => {
    wrapper.find('#createIngredient').simulate(
      'click', 
      {preventDefault() { /**/ }}
    );
    expect(mockIngedientToggle.mock.calls.length).toBe(1);
    expect(mockIngedientToggle.mock.calls[0][0]).toBe(TopBitDisplay.CREATE_INGREDIENT);
  });
  it('should submit the recipe click', () => {
    wrapper.find('#createRecipe').simulate(
      'click', 
      {preventDefault() { /**/ }}
    );
    expect(mockIngedientToggle.mock.calls.length).toBe(1);
    expect(mockIngedientToggle.mock.calls[0][0]).toBe(TopBitDisplay.CREATE_RECIPE);
  });
});   