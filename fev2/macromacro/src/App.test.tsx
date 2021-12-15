import React from 'react';
import { getByLabelText, render, screen, within } from '@testing-library/react';
import App from './App';
import { server } from "./test/mockServer";
import userEvent from '@testing-library/user-event'
import { searchResponse } from "./test/responseFixtures";
import { act } from "react-dom/test-utils";
import { FirebaseAPI } from "./firebaseApi/api";


class TestFirebaseAPIWithNoAuth extends FirebaseAPI {

    async signIn() {
        throw new Error('really need to learn to test this better')
    }

    isUserSignedIn() {
        return true
    }

    signOut() {}

}

let firebaseApi: FirebaseAPI;

beforeAll(() => {
        server.listen(
            {
                onUnhandledRequest: (req) => {
                    console.error(`unhandled request to ${req.url}`)
                    throw Error(`unhandled request to ${req.url}`)
                }
            }
        )
    }
);

beforeEach(() => {
    firebaseApi = new TestFirebaseAPIWithNoAuth(
        'test-ingredient-collection',
        'test-recipe-collection'
    )
})

afterEach(async () => {
    await firebaseApi.deleteCollections()
})


test('Can add an ingredient to the recipe and save it', async () => {
    const { debug } = render(<App firebaseApi={firebaseApi} />);

    const searchTable = screen.getByText('Search').closest('div')!
    const searchInput = within(searchTable).getByLabelText('search text');
    expect(searchInput).toBeInTheDocument();

    // why does wrapping this in act make it do nothing??
    userEvent.type(searchInput, 'bread')
    userEvent.type(searchInput, '{enter}')

    expect(await screen.findByText(searchResponse.foods![0].brandOwner!)).toBeInTheDocument();

    const row = screen.getAllByText('BREAD')[0].closest('tr')!

    const button = getByLabelText(row, 'expand row')

    act(() => {
        userEvent.click(button)
    })
    const entryTable = (await screen.findByText( 'Add amount to recipe')).closest('table')!

    const firstPortionInput = (await within(entryTable).findAllByRole('textbox'))[0]
    userEvent.type(firstPortionInput, '0.5')

    userEvent.type(firstPortionInput, '{enter}')

    // const recipesTable = screen.getAllByLabelText('simple table')[0]
    const recipesTable = screen.getByText('Recipe').closest('table')!
    const breadCell = within(recipesTable).getByText('BREAD')
    expect(breadCell).toBeInTheDocument()

    const breadRow = breadCell.closest('tr')!
    expect(within(breadRow).getByText('131.5')).toBeInTheDocument()

    const recipeNameForm = screen.getByText('Recipe Name').closest('form')!
    const recipeNameInput = within(recipeNameForm).getByRole('textbox')

    userEvent.type(recipeNameInput, 'Test Ingredient')
    act(() => {
        userEvent.click(within(recipeNameForm).getByText('Save'))
    })

    const customIngredientsHeader = screen.getByText('Custom Ingredients');
    expect(customIngredientsHeader).toBeInTheDocument()
    const createdIngredientsTable = customIngredientsHeader.closest('table')!
    expect(createdIngredientsTable).toBeInTheDocument()
    const createdRecipeRow = (await within(createdIngredientsTable).findByText('Test Ingredient')).closest('tr')

    expect(createdRecipeRow).toBeInTheDocument()
});
