import React from 'react';
import './App.css';
import Input from '@mui/material/Input';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { SearchResultFood } from "./usda";
import { PortionMacros, RowData } from "./classes";
import { MathInputState } from "./conversions";
import { IngredientsTable } from "./ingredientsTable";

const ariaLabel = {'aria-label': 'description'};

export function IngredientSearch(
    search: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
    searchText: string,
    setSearchText: (value: string) => void,
    searchData: RowData[],
    createData: (searchResult: SearchResultFood) => RowData,
    detailedMacros: Record<string, PortionMacros[]>,
    rowsOpen: Record<string, boolean>,
    toggleOpen: (fdcId: number) => void,
    enteredAmounts: Record<number, Record<number, MathInputState>>,
    changePortionAmount: (fdcId: number) => (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
    addRecipeItem: (fdcId: number) => (portionIdx: number) => () => void
) {
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
        </TableContainer>
    </>;
}
