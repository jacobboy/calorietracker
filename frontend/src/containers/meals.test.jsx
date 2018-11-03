import * as React from 'react'
import MealsComponent from './meals'
import { mount } from 'enzyme'
import { meal, makeIngredient, FOOD_UNIT } from '../classes'
import { createStore } from 'redux'
import { reducer } from '../reducers'
import { Provider } from 'react-redux'

function mockMeals (nMeals, nFoods) {
  const meals = []
  for (let i = 0; i < nMeals; i++) {
    const foods = []
    for (let j = 0; j < nFoods; j++) {
      const food = makeIngredient(
        'ingredient_' + i.toString + j.toString(),
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        i * 10 + j,
        FOOD_UNIT.g,
        false
      )
      foods.push(food)
    }
    meals.push(meal(foods))
  }
  return meals
}

describe('When the meals component is selected', () => {
  let wrapper, today, store

  const nMeals = 2
  const nFoods = 2

  beforeEach(() => {
    today = mockMeals(nMeals, nFoods)
    let state = { today }
    store = createStore(reducer, state)

    wrapper = mount(
      <Provider store={store}>
        <MealsComponent />
      </Provider>
    )
  })

  it(`should remove ingredient 1 on meal 0`, () => {
    const foodToRemove = today[0].foods[1]
    const foodToRemain = today[0].foods[0]
    wrapper.find('#removeFood_' + foodToRemove.uid).simulate('click')
    expect(store.getState().today[0].foods.length).toBe(1)
    expect(store.getState().today[0].foods).toBe([foodToRemain])
  })
})
