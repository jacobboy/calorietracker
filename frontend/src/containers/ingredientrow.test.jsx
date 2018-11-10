import * as React from 'react'
import IngredientRow from './ingredientrow'
import { mount } from 'enzyme'
import { createStore } from 'redux'
import { reducer } from '../reducers'
import { Provider } from 'react-redux'
import { FOOD_UNIT, makeIngredient, meal, scaleFood } from '../classes'
import { TopBitDisplay } from '../types'

// TODO try these with foods already in the meal/recipe

describe('When the track food button is clicked', () => {
  let wrapper, store, thisMeal, thisIngred

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5]
    thisIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false)
    thisMeal = meal([])
    store = createStore(reducer, {
      topbit: { display: TopBitDisplay.MEALS },
      today: [thisMeal]
    })
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <IngredientRow item={thisIngred} />
        </tbody></table>
      </Provider>
    )
  })

  it(`adds to the meal if it should`, () => {
    const newAmount = 100
    wrapper.find('#trackFoodAmountInput').simulate('change', { target: { value: newAmount } })
    wrapper.find('#trackFoodSubmit').simulate('click')

    const expectedIngred = scaleFood(thisIngred, newAmount)
    expect(store.getState().today.length).toEqual(1)
    verifyIngredientList(store.getState().today[0], thisMeal.withFood(expectedIngred))
  })
})

describe('When the track food button is clicked', () => {
  let wrapper, store, thisIngred

  beforeEach(() => {
    let [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5]
    thisIngred = makeIngredient('foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false)
    store = createStore(reducer, {
      topbit: { display: TopBitDisplay.CREATE_RECIPE, recipe: [] }
    })
    wrapper = mount(
      <Provider store={store}>
        <table><tbody>
          <IngredientRow item={thisIngred} />
        </tbody></table>
      </Provider>
    )
  })

  it(`adds to the recipe if it should`, () => {
    const newAmount = 100
    wrapper.find('#trackFoodAmountInput').simulate('change', { target: { value: newAmount } })
    wrapper.find('#trackFoodSubmit').simulate('click')

    const expectedIngred = scaleFood(thisIngred, newAmount)
    expect(store.getState().topbit.recipe.length).toEqual(1)
    verifyIngredientList(store.getState().topbit.recipe, [expectedIngred])
  })
})

function verifyIngredientList (foods1, foods2) {
  const checkAttributes = ['name', 'fat', 'carbs', 'protein', 'calories', 'amount']
  expect(foods1.length).toEqual(foods2.length)
  for (let i = 0; i < foods1.length; i++) {
    for (let attr in checkAttributes) {
      expect(foods1[i][attr]).toEqual(foods2[i][attr])
    }
  }
}
