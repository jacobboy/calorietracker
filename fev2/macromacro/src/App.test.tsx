import React from 'react';
import {
    findByRole,
    findByText, getByLabelText,
    getByRole,
    getByText,
    render,
    screen,
    within
} from '@testing-library/react';
import App from './App';
import { server } from "./test/mockServer";
import userEvent from '@testing-library/user-event'
import { searchResponse } from "./test/responseFixtures";
import { act } from "react-dom/test-utils";

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


test('Can add an ingredient to the recipe', async () => {
    render(<App/>);

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();

    userEvent.type(inputElement, 'bread')
    expect(inputElement).toHaveValue('bread')

    userEvent.type(inputElement, '{enter}')

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
    const recipesTable = screen.getByText('Recipe').parentElement!
    const breadCell = within(recipesTable).getByText('BREAD')
    expect(breadCell).toBeInTheDocument()

    const breadRow = breadCell.closest('tr')!
    expect(within(breadRow).getByText('131.5')).toBeInTheDocument()
});
