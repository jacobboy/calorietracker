import * as storage from '.'
import * as client from '../client'
import { CheddarCheese } from '../mocks'
import { Report } from '../ndbapi/classes'

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
