import React, { useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { SearchResultFood } from "./usda";
import { IngredientId, IngredientRowData, PortionMacros } from "./classes";
import { IngredientsTable } from "./ingredientsTable";
import { getApiClient } from "./calls";
import { getMacros, MathInputState } from "./conversions";

const ariaLabel = {'aria-label': 'description'};

export function IngredientSearch(
    detailedMacros: Record<IngredientId, PortionMacros[]>,
    addRecipeItem: (id: IngredientId, name: string) => (portionIdx: number, amount: MathInputState) => () => void,
    getFood: (id: IngredientId) => void,
    createdIngredients: IngredientRowData[]
) {
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState<IngredientRowData[]>([])
    const [rowsOpen, setRowsOpen] = useState<Record<IngredientId, boolean>>({})
    const [enteredAmounts, setEnteredAmounts] = useState<Record<IngredientId, Record<number, MathInputState>>>({})

    function toggleOpen(id: IngredientId) {
        getFood(id)
        setRowsOpen({
            ...rowsOpen,
            [id]: !rowsOpen[id]
        })
    }

    function createSearchIngredientRowData(searchResult: SearchResultFood): IngredientRowData {
        return {
            dataType: searchResult.dataType,
            brandOwner: searchResult.brandOwner,
            brandName: searchResult.brandName,
            id: searchResult.fdcId,
            name: searchResult.description,
            ...getMacros(searchResult.foodNutrients || []),
            // householdServingFullText: searchResult.householdServingFullText
        }
    }

    async function search(event: React.FormEvent<HTMLFormElement>) {
        if (searchText) {
            const api = getApiClient();
            api.getFoodsSearch(searchText).then(
                (response) => {
                    if (response.data && response.data.foods) {
                        // setSearchResults(response.data.foods)
                        setSearchData(response.data.foods.map(createSearchIngredientRowData))
                    }
                }
            )
        }
        event.preventDefault();
    }

    function changePortionAmount(id: IngredientId) {
        return ( portionIdx: number) => {
            return (input: string, evaluated: number, isValid: boolean) => {
                setEnteredAmounts(
                    {
                        ...enteredAmounts,
                        [id]: {
                            ...(enteredAmounts[id] || {}),
                            [portionIdx]: {input, evaluated, isValid}
                        }
                    }
                )
            }
        }
    }

    return <>
        <TableContainer component={Paper}>
            <header>
                Search
            </header>
            <form onSubmit={search}>
                <Input placeholder="Placeholder" value={searchText}
                       onChange={e => setSearchText(e.target.value)} inputProps={ariaLabel}/>
                <input type="submit" value="Submit"/>
            </form>
            {IngredientsTable(searchData, detailedMacros, rowsOpen, toggleOpen, enteredAmounts, changePortionAmount, addRecipeItem)}
            {/*{IngredientsTable(searchData, detailedMacros, rowsOpen, toggleOpen, enteredAmounts, changePortionAmount, addRecipeItem)}*/}
        </TableContainer>
    </>;
}
