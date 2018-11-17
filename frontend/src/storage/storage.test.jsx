import * as storage from '.'
import * as client from '../client'

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
