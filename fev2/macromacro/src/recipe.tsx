import React, { useState } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DetailedMacros, RecipeItem, Unit } from "./classes";
import {
    MathInput,
    MathInputState,
    multiply100gMacro,
    round,
    scaleUpOrUndefined
} from "./conversions";
import { TableFooter } from "@mui/material";

function sum(xs: number[]): number {
    const rounded = round(xs.reduce((a, b) => a + b, 0))
    // it won't be undefined under current behavior of round, just make the compiler happy
    return rounded !== undefined ? rounded : 0
}

export function RecipeRow(
    recipeItem: RecipeItem,
    macros: DetailedMacros,
    idx: number,
    changeRecipeItemAmount: (input: string, evaluated: number, isValid: boolean) => void
) {

    return (
        <React.Fragment key={`${recipeItem.fdcId}-${idx}-recipe-frag`}>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}
                      key={`${recipeItem.fdcId}-${idx}-recipeitem`}>
                <TableCell component="th" scope="row">
                    <a target="_blank" rel="noreferrer"
                       href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${recipeItem.fdcId}/nutrients`}>{recipeItem.name}</a>
                </TableCell>
                <TableCell align="right">{MathInput(recipeItem.amount.input, recipeItem.amount.isValid, changeRecipeItemAmount)}</TableCell>
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

export function Recipe(
    recipeItems: RecipeItem[],
    changeRecipeItemAmount: (idx: number) => (input: string, evaluated: number, isValid: boolean) => void
) {
    const [amount, setAmount] = useState<MathInputState>({input: '', evaluated: 0, isValid: true})
    const [unit, setUnit] = useState<Unit>(Unit.g)

    const macros: DetailedMacros[] = recipeItems.map((recipeItem) => multiply100gMacro(
        recipeItem.macros.baseMacros,
        recipeItem.macros.description,
        recipeItem.amount.evaluated * recipeItem.macros.amount,
        recipeItem.macros.source,
        recipeItem.macros.id
    ))

    const totalRecipeAmount = sum(recipeItems.map((recipeItem) => recipeItem.amount.evaluated))

    const totalMacros = {
        amount: amount !== null ? amount : totalRecipeAmount,
        unit: unit,
        calories: sum(recipeItems.map((recipeItem, idx) => macros[idx].calories!)),
        fat: sum(recipeItems.map((recipeItem, idx) => macros[idx].fat!)),
        carbs: sum(recipeItems.map((recipeItem, idx) => macros[idx].carbs!)),
        protein: sum(recipeItems.map((recipeItem, idx) => macros[idx].protein!)),
        totalFiber: sum(recipeItems.map((recipeItem, idx) => macros[idx].totalFiber!)),
        sugar: sum(recipeItems.map((recipeItem, idx) => macros[idx].sugar!))
    }

    const amountForPer100: number = amount.evaluated || totalRecipeAmount
    const scalePerGram: number = 100 / amountForPer100

    const per100Macros = {
        amount: 100,
        unit: unit,
        calories: round(scaleUpOrUndefined(scalePerGram, totalMacros.calories)),
        fat: round(scaleUpOrUndefined(scalePerGram, totalMacros.fat)),
        carbs: round(scaleUpOrUndefined(scalePerGram, totalMacros.carbs)),
        protein: round(scaleUpOrUndefined(scalePerGram, totalMacros.protein)),
        totalFiber: round(scaleUpOrUndefined(scalePerGram, totalMacros.totalFiber)),
        sugar: round(scaleUpOrUndefined(scalePerGram, totalMacros.sugar)),
    }

    function handleRecipeAmountChange(input: string, evaluated: number, isValid: boolean) {
        setAmount({input, isValid, evaluated})
    }

    return (
        <TableContainer component={Paper}>
            <header className="App-header">
                Recipe
            </header>
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
                            (recipeItem, idx) => RecipeRow(
                                recipeItem,
                                macros[idx],
                                idx,
                                changeRecipeItemAmount(idx)
                            )
                        )
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell align="left">Total</TableCell>
                        <TableCell align="right">{MathInput(amount.input, amount.isValid, handleRecipeAmountChange)}</TableCell>
                        <TableCell align="right"/>
                        <TableCell align="right">{totalMacros.calories}</TableCell>
                        <TableCell align="right">{totalMacros.fat}</TableCell>
                        <TableCell align="right">{totalMacros.carbs}</TableCell>
                        <TableCell align="right">{totalMacros.protein}</TableCell>
                        <TableCell align="right">{totalMacros.totalFiber}</TableCell>
                        <TableCell align="right">{totalMacros.sugar}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left">Per 100</TableCell>
                        <TableCell align="right">100</TableCell>
                        <TableCell align="right"/>
                        <TableCell align="right">{per100Macros.calories}</TableCell>
                        <TableCell align="right">{per100Macros.fat}</TableCell>
                        <TableCell align="right">{per100Macros.carbs}</TableCell>
                        <TableCell align="right">{per100Macros.protein}</TableCell>
                        <TableCell align="right">{per100Macros.totalFiber}</TableCell>
                        <TableCell align="right">{per100Macros.sugar}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
