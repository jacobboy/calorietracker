import React, { useState } from 'react';
import './App.css';
import Input from '@mui/material/Input';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { DataTypes, SearchResultFood } from "./usda";
import {
    CustomIngredient,
    IngredientId,
    IngredientRowData,
    IngredientSource,
    PortionMacros
} from "./classes";
import { IngredientsTable } from "./ingredientsTable";
import { getApiClient, getMeasuresForOneFood } from "./calls";
import { getMacros, MathInputState, multiplyBaseMacro } from "./conversions";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

export function IngredientSearch(
    addRecipeItem: (source: IngredientSource) => (fromPortion: PortionMacros, amount: MathInputState) => () => void,
    createdIngredients: CustomIngredient[]
) {
    const [searchText, setSearchText] = useState('');
    const [searchDataTypes, setSearchDataTypes] = useState<Record<DataTypes, boolean>>({'Branded': true, 'Foundation': true, 'Survey (FNDDS)': true, 'SR Legacy': true})
    const [searchData, setSearchData] = useState<IngredientRowData[]>([])
    const [brandName, setBrandName] = useState<string>('')
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
            source: {
                id: searchResult.fdcId,
                name: searchResult.description,
                dataSource: 'fdcApi'
            },
            ...getMacros(searchResult.foodNutrients || []),
            // householdServingFullText: searchResult.householdServingFullText
        }
    }

    function createCreatedIngredientRowData(ingredient: CustomIngredient): IngredientRowData {
        return {
            dataType: 'createdIngredient',
            brandOwner: ingredient.brandOwner,
            brandName: ingredient.brandName,
            source: {
                id: ingredient.id,
                name: ingredient.name,
                dataSource: 'createIngredient'
            },
            ...ingredient.baseMacros,
            // householdServingFullText: ingredient.householdServingFullText
        }
    }

    async function search(event: React.FormEvent<HTMLFormElement>) {
        const dataType = Object.entries(searchDataTypes)
            .filter(([_, shouldUse]) => shouldUse)
            .map(([dataType, _]) => dataType) as DataTypes[]
        if (searchText) {
            let modifiedSearchText = searchText
            if (brandName !== '' && !searchText.includes('brandName:')) {
                modifiedSearchText = `${modifiedSearchText} brandName:${brandName}`
            }
            const api = getApiClient();
            api.getFoodsSearch(
                modifiedSearchText,
                dataType
            ).then(
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

    function createPortionMacrosFromCreatedIngredient(ingredients: CustomIngredient[]): Record<IngredientId, PortionMacros[]> {
        const allPortionMacros: Record<IngredientId, PortionMacros[]> = {}
        ingredients.forEach((ingredient) => {
            allPortionMacros[ingredient.id] = ingredient.portions.map(
                    (portion, idx) => {
                        return {
                            dataProvenance: 'createIngredient',
                            ...multiplyBaseMacro(
                                ingredient.baseMacros,
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

    function handleCheckboxChange(dataType: DataTypes) {
        return () => {
            setSearchDataTypes((prevState) => {
                return {
                    ...prevState,
                    [dataType]: !prevState[dataType]
                }
            })
        }
    }

    return <>
        <TableContainer component={Paper}>
            <header>
                Search
            </header>
            <form onSubmit={search}>
                <Input placeholder="Search text" value={searchText}
                       onChange={e => setSearchText(e.target.value)} inputProps={{'aria-label': 'search text'}}/>
                <Input placeholder="Brand name" value={brandName}
                       onChange={e => setBrandName(e.target.value)} inputProps={{'aria-label': 'brand name'}}/>

                <FormGroup>
                    {
                        Object.entries(searchDataTypes).map(([dataType, shouldUse]) => {
                            return <FormControlLabel
                                key={`${dataType}-form-control`}
                                control={
                                    <Checkbox checked={shouldUse}
                                              onChange={handleCheckboxChange(dataType as DataTypes)}
                                              name={dataType}/>
                                }
                                label={dataType}
                            />
                        })
                    }
                </FormGroup>
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
