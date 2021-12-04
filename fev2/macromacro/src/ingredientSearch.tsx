import React, { useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { SearchResultFood } from "./usda";
import { CustomIngredient, IngredientId, IngredientRowData, PortionMacros } from "./classes";
import { IngredientsTable } from "./ingredientsTable";
import { getApiClient, getMeasuresForOneFood } from "./calls";
import { getMacros, MathInputState, multiply100gMacro } from "./conversions";

const ariaLabel = {'aria-label': 'description'};

export function IngredientSearch(
    addRecipeItem: (id: IngredientId, name: string) => (fromPortion: PortionMacros, amount: MathInputState) => () => void,
    createdIngredients: CustomIngredient[]
) {
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState<IngredientRowData[]>([])
    const [rowsOpen, setRowsOpen] = useState<Record<IngredientId, boolean>>({})
    const [enteredAmounts, setEnteredAmounts] = useState<Record<IngredientId, Record<number, MathInputState>>>({})
    const [portionMacros, setPortionMacros] = useState<Record<IngredientId, PortionMacros[]>>({})

    function toggleOpen(id: IngredientId) {
        setRowsOpen({
            ...rowsOpen,
            [id]: !rowsOpen[id]
        })
    }

    function fetchFdcPortions(id: IngredientId) {
        if (!(id in portionMacros)) {
            getMeasuresForOneFood(id).then(
                (detailedMacro) => {
                    setPortionMacros((prevState) => {
                        return {...prevState, [id]: detailedMacro}
                    })
                }
            )
        }
    }

    function fetchFdcPortionsAndToggleOpen(id: IngredientId) {
        fetchFdcPortions(id)
        toggleOpen(id);
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

    function createCreatedIngredientRowData(ingredient: CustomIngredient): IngredientRowData {
        return {
            dataType: 'createdIngredient',
            brandOwner: ingredient.brandOwner,
            brandName: ingredient.brandName,
            id: ingredient.id,
            name: ingredient.name,
            ...ingredient.macros100g,
            // householdServingFullText: ingredient.householdServingFullText
        }
    }

    function createPortionMacrosFromCreatedIngredient(ingredients: CustomIngredient[]): Record<IngredientId, PortionMacros[]> {
        const allPortionMacros: Record<IngredientId, PortionMacros[]> = {}
        ingredients.forEach((ingredient) => {
            allPortionMacros[ingredient.id] = ingredient.portions.map(
                    (portion, idx) => {
                        return {
                            dataProvenance: 'createIngredient',
                            ...multiply100gMacro(
                                ingredient.macros100g,
                                portion.description,
                                portion.amount,
                                {source: 'portion', id: idx}
                            )
                        }
                    }
                )
            }
        )
        return allPortionMacros
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
            {IngredientsTable(
                'Custom Ingredients',
                createdIngredients.map(createCreatedIngredientRowData),
                createPortionMacrosFromCreatedIngredient(createdIngredients),
                rowsOpen,
                toggleOpen,
                enteredAmounts,
                changePortionAmount,
                addRecipeItem
            )}
            {IngredientsTable(
                'FDC Search Results',
                searchData,
                portionMacros,
                rowsOpen,
                fetchFdcPortionsAndToggleOpen,
                enteredAmounts,
                changePortionAmount,
                addRecipeItem
            )}
        </TableContainer>
    </>;
}
