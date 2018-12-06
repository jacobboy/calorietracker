import * as React from 'react';
import { shallow } from 'enzyme';
import { MathInput } from './mathinput';

describe('The MathInput', () => {
  it('displays the amount if provided', () => {
    const wrapper = shallow(
      <MathInput id="theInput" amount="theAmount" onChange={e => undefined} />
    );
    expect(wrapper.find('#theInput').props().value).toEqual('theAmount');
  });
  it('displays the changed value', () => {
    const wrapper = shallow(
      <MathInput id="theInput" amount={'100'} onChange={e => undefined} />
    );
    wrapper.find('#theInput').simulate('change', { target: { value: '12' } });
    expect(wrapper.find('#theInput').props().value).toEqual('12');
  });
  it('displays the amount provided on focus loss', () => {
    const wrapper = shallow(
      <MathInput id="theInput" amount={'100'} onChange={e => undefined} />
    );
    wrapper.find('#theInput').simulate('change', { target: { value: '12' } });
    wrapper.find('#theInput').simulate('blur');
    expect(wrapper.find('#theInput').props().value).toEqual('100');
  });
  it('calls the handler with the value of an equation', () => {
    const handler = jest.fn();
    const wrapper = shallow(
      <MathInput id="theInput" amount={'100'} onChange={handler} />
    );
    wrapper
      .find('#theInput')
      .simulate('change', { target: { value: '12*12' } });
    expect(handler.mock.calls).toEqual([[144]]);
  });
  it('calls the handler with number input', () => {
    const handler = jest.fn();
    const wrapper = shallow(
      <MathInput id="theInput" amount={'100'} onChange={handler} />
    );
    wrapper.find('#theInput').simulate('change', { target: { value: '1212' } });
    expect(handler.mock.calls).toEqual([[1212]]);
  });
  it('ignores non-equation input', () => {
    const handler = jest.fn();
    const wrapper = shallow(
      <MathInput id="theInput" amount={'100'} onChange={handler} />
    );
    wrapper
      .find('#theInput')
      .simulate('change', {
        target: { value: '100\'); drop table RECIPES; --' }
      });
    expect(handler.mock.calls.length).toEqual(0);
  });
});
