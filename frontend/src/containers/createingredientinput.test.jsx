import * as React from 'react'
import CreateIngredientInput from './createingredientinput'
import { mount } from 'enzyme'
import { createStore } from 'redux'
import { reducer } from '../reducers'
import * as storage from '../storage'
import { Provider } from 'react-redux'
import { FOOD_UNIT, makeIngredient } from '../classes'

describe('When ingredient create button is clicked', () => {
  let wrapper, store

  beforeEach(() => {
    window.localStorage.clear()
    store = createStore(reducer, { saved: { ingredients: [] } })
    wrapper = mount(
      <Provider store={store}>
        <CreateIngredientInput />
      </Provider>
    )
  })

  it(`creates the ingredient appropriately`, () => {
    const mockSave = jest.fn()
    // TODO will this affect other tests?
    storage.saveIngredient = mockSave
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5]

    wrapper.find('#nameInput').simulate('change', { target: { value: 'foo' } })
    wrapper.find('#fatInput').simulate('change', { target: { value: fat } })
    wrapper.find('#carbsInput').simulate('change', { target: { value: carbs } })
    wrapper.find('#proteinInput').simulate('change', { target: { value: protein } })
    wrapper.find('#caloriesInput').simulate('change', { target: { value: calories } })
    wrapper.find('#amountInput').simulate('change', { target: { value: amount } })
    wrapper.find('#submitIngredient').simulate('submit')

    expect(mockSave.mock.calls.length).toBe(1)
    expect(mockSave.mock.calls[0].length).toBe(1)
    const foundIngred = mockSave.mock.calls[0][0]
    const expectedIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false)
    expectedIngred.uid = foundIngred.uid
    expect(foundIngred).toEqual(expectedIngred)
  })
})
