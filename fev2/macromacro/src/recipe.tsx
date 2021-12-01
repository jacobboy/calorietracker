import React from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { RecipeItem } from "./classes";
import { multiply100gMacro, round } from "./conversions";


export function RecipeRow(
    recipeItem: RecipeItem,
    idx: number
    // changePortionAmount: (portionIdx: number) => (input: string, evaluated: number, isValid: boolean) => void,
) {

    const macros = multiply100gMacro(
        recipeItem.macros.baseMacros,
        recipeItem.macros.description,
        recipeItem.amount * recipeItem.macros.amount,
        recipeItem.macros.source,
        recipeItem.macros.id
    )

    return (
        <React.Fragment key={`${recipeItem.fdcId}-${idx}-recipe-frag`}>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}
                      key={`${recipeItem.fdcId}-${idx}-recipeitem`}>
                <TableCell component="th" scope="row">
                    <a target="_blank" rel="noreferrer"
                       href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${recipeItem.fdcId}/nutrients`}>{recipeItem.name}</a>
                </TableCell>
                <TableCell align="right">{recipeItem.amount}</TableCell>
                <TableCell align="right">{recipeItem.macros.description}</TableCell>
                <TableCell align="right">{round(macros.calories)}</TableCell>
                <TableCell align="right">{round(macros.fat)}</TableCell>
                <TableCell align="right">{round(macros.carbs)}</TableCell>
                <TableCell align="right">{round(macros.protein)}</TableCell>
                <TableCell align="right">{round(macros.totalFiber)}</TableCell>
                <TableCell align="right">{round(macros.sugar)}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function Recipe(recipeItems: RecipeItem[]) {
    return <>
        <header className="App-header">
            Recipe
        </header>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow key='header'>
                        <TableCell align="left">Food</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        <TableCell align="right">Total Fiber</TableCell>
                        <TableCell align="right">Sugar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        recipeItems.map(
                            (recipeItem, idx) => RecipeRow(recipeItem, idx)
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}
