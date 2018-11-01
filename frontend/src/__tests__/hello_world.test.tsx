import * as React from 'react';
import { TopBitComponent } from '../components/topbit';
import { TopBitDisplay } from '../types';
import { shallow, ShallowWrapper } from 'enzyme';

describe('When the form is submitted', () => {
  // tslint:disable-next-line:no-any  
  let wrapper: ShallowWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  const mockIngedientToggle = jest.fn();
  beforeEach(() => {
    wrapper = shallow(
      <TopBitComponent 
        display={TopBitDisplay.MEALS}
        onIngredientToggle={mockIngedientToggle}
      />    
      );
    });

  it('should call the mock login function', () => {
    wrapper.find('#createIngredient').simulate(
      'click', 
      {preventDefault() { /**/ }}
    );
    expect(mockIngedientToggle.mock.calls.length).toBe(1);
  });
});   