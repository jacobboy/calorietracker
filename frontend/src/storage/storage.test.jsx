import * as storage from '.'
import * as client from '../client'
import { CheddarCheese } from '../mocks'
import { Report } from '../ndbapi/classes'
import { ingredientFromReport, makeIngredient, makeRecipe, FOOD_UNIT, amountOf } from '../classes'

describe('Ingredient saving', () => {
  it('exports a single object containing the correct attributes', () => {
    const mockSend = jest.fn()
    client.sendIngredient = mockSend

    const ingredient = {
      name: 'foo',
      uid: 'foo_id',
      fat: 1,
      carbs: 2,
      protein: 3,
      calories: 4,
      amount: 5,
      unit: 'g'
    }
    storage.saveIngredient(ingredient)
    expect(mockSend.mock.calls.length).toBe(1)
    const foundIngred = mockSend.mock.calls[0][0]
    expect(foundIngred).toEqual(ingredient)
  })
})

describe('Report saving', () => {
  it('can save a report', () => {
    const cheeseReport = Report.new(CheddarCheese.report)
    const mockSetItem = jest.fn()
    window.localStorage.setItem = mockSetItem
    storage.saveReport(cheeseReport)
    // getNDBKey(cheeseReport.ndbno)
    expect(mockSetItem.mock.calls[0][1]).toBe(JSON.stringify(cheeseReport))
  })
  it('can load a saved report', () => {
    const mockGetItem = jest.fn()
    const cc = Report.new(CheddarCheese.report)
    mockGetItem.mockReturnValue(JSON.stringify(CheddarCheese.report))
    window.localStorage.getItem = mockGetItem

    const report = storage.loadReport('12345')

    expect(mockGetItem).toHaveBeenCalledTimes(1)

    expect(report.carbs).toEqual(cc.carbs)
  })
})

describe('Recipe saving', () => {
  it('can save and load a recipe', () => {
    const ndbIngred = ingredientFromReport(Report.new(CheddarCheese.report))
    const amountOfNdbIngred = amountOf(ndbIngred, 100)
    const [fat, carbs, protein, calories, amount] = [1, 2, 3, 4, 5]
    const customIngred = makeIngredient(
      'foo', fat, carbs, protein, calories, amount, FOOD_UNIT.g, false
    ).baseFood
    const amountOfCustomIngred = amountOf(customIngred, 100)
    const recipe = makeRecipe('bar', [amountOfNdbIngred, amountOfCustomIngred])

    const mockSetItem = jest.fn()
    window.localStorage.setItem = mockSetItem
    storage.saveRecipe(recipe)
    const savedRecipe = mockSetItem.mock.calls[0][1]

    const mockGetItem = jest.fn()
    mockGetItem.mockReturnValue(savedRecipe)
    window.localStorage.getItem = mockGetItem

    const loadedRecipe = storage.loadRecipe('hi')

    expect(loadedRecipe.foods[1].name).toBe('foo')
  })
})
