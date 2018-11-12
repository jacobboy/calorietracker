import * as React from 'react'
import { Provider } from 'react-redux'
import CreateIngredientInput from './createingredientinput'
import { mount } from 'enzyme'
import { createStore } from 'redux'
import { reducer } from '../reducers'
import * as storage from '../storage'
import { FOOD_UNIT, makeIngredient, makeScaledIngredient } from '../classes'

describe('When ingredient create button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>
  let store: Store<{saved: {ingredients: Ingredient[]}}, AnyAction>

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
    wrapper.find('#createIngredientAmountInput').simulate('change', { target: { value: amount } })
    wrapper.find('#submitIngredient').simulate('submit')

    expect(mockSave.mock.calls.length).toBe(1)
    expect(mockSave.mock.calls[0].length).toBe(1)
    const foundFood = mockSave.mock.calls[0][0]
    const expectedFood = makeIngredient(
      'foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false
    )

    expect(foundFood.name).toEqual(expectedFood.name)
    expect(foundFood.fat).toEqual(expectedFood.fat)
    expect(foundFood.carbs).toEqual(expectedFood.carbs)
    expect(foundFood.protein).toEqual(expectedFood.protein)
    expect(foundFood.calories).toEqual(expectedFood.calories)
    expect(foundFood.amount).toEqual(expectedFood.amount)

    verifyIngredientList(store.getState().saved.ingredients, [expectedFood])
  })

  it(`scales the ingredient appropriately`, () => {
    const mockSave = jest.fn()
    // TODO will this affect other tests?
    storage.saveIngredient = mockSave
    let [fat, carbs, protein, calories, amount, convertAmount] = [1, 2, 3, 4, 5, 1]

    wrapper.find('#nameInput').simulate('change', { target: { value: 'foo' } })
    wrapper.find('#fatInput').simulate('change', { target: { value: fat } })
    wrapper.find('#carbsInput').simulate('change', { target: { value: carbs } })
    wrapper.find('#proteinInput').simulate('change', { target: { value: protein } })
    wrapper.find('#caloriesInput').simulate('change', { target: { value: calories } })
    wrapper.find('#createIngredientAmountInput').simulate('change', { target: { value: amount } })
    wrapper.find('#createIngredientConvertAmountInput').simulate('change', { target: { value: convertAmount } })
    wrapper.find('#submitIngredient').simulate('submit')

    expect(mockSave.mock.calls.length).toBe(1)
    expect(mockSave.mock.calls[0].length).toBe(1)
    const foundFood = mockSave.mock.calls[0][0]
    const expectedFood = makeScaledIngredient(
      'foo', fat, carbs, protein, calories, amount, convertAmount, FOOD_UNIT.g, false
    )

    expect(foundFood.name).toEqual(expectedFood.name)
    expect(foundFood.fat).toEqual(expectedFood.fat)
    expect(foundFood.carbs).toEqual(expectedFood.carbs)
    expect(foundFood.protein).toEqual(expectedFood.protein)
    expect(foundFood.calories).toEqual(expectedFood.calories)
    expect(foundFood.amount).toEqual(expectedFood.amount)

    verifyIngredientList(store.getState().saved.ingredients, [expectedFood])
  })
})

function verifyIngredientList (foods1: Ingredient[], foods2: Ingredient[]) {
  expect(foods1.length).toEqual(foods2.length)
  for (let i = 0; i < foods1.length; i++) {
    const foundFood = foods1[i]
    const expectedFood = foods2[i]
    expect(foundFood.name).toEqual(expectedFood.name)
    expect(foundFood.fat).toEqual(expectedFood.fat)
    expect(foundFood.carbs).toEqual(expectedFood.carbs)
    expect(foundFood.protein).toEqual(expectedFood.protein)
    expect(foundFood.calories).toEqual(expectedFood.calories)
    expect(foundFood.amount).toEqual(expectedFood.amount)
  }
}
