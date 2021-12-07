import React, { useState } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DetailedMacros, RecipeItemUnsaved, RecipeUnsaved } from "./classes";
import {
    MathInput,
    MathInputState,
    multiply100gMacro,
    round,
    scaleUpOrUndefined
} from "./conversions";
import { TableFooter, IconButton, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton';

function sum(xs: number[]): number {
    const rounded = round(xs.reduce((a, b) => a + b, 0))
    // it won't be undefined under current behavior of round, just make the compiler happy
    return rounded !== undefined ? rounded : 0
}

export function RecipeRow(
    recipeItem: RecipeItemUnsaved,
    macros: DetailedMacros,
    idx: number,
    changeRecipeItemAmount: (input: string, evaluated: number, isValid: boolean) => void,
    removeRecipeItem: () => void
) {

    return (
        <React.Fragment key={`${recipeItem.source.id}-${idx}-recipe-frag`}>
            <TableRow sx={{'& > *': {borderBottom: 'unset'}}}
                      key={`${recipeItem.source.id}-${idx}-recipeitem`}>
                <TableCell component="th" scope="row">
                    <a target="_blank" rel="noreferrer"
                       href={`https://fdc.nal.usda.gov/fdc-app.html#/food-details/${recipeItem.source.id}/nutrients`}>{recipeItem.source.name}</a>
                </TableCell>
                <TableCell
                    align="right">{MathInput(recipeItem.amount.input, recipeItem.amount.isValid, changeRecipeItemAmount)}</TableCell>
                <TableCell align="right">{recipeItem.macros.description}</TableCell>
                <TableCell align="right">{round(macros.calories)}</TableCell>
                <TableCell align="right">{round(macros.fat)}</TableCell>
                <TableCell align="right">{round(macros.carbs)}</TableCell>
                <TableCell align="right">{round(macros.protein)}</TableCell>
                <TableCell align="right">{round(macros.totalFiber)}</TableCell>
                <TableCell align="right">{round(macros.sugar)}</TableCell>
                <TableCell align="right">
                    <IconButton color="primary" aria-label="remove recipe item" component="span" onClick={removeRecipeItem}>
                        <ClearIcon/>
                    </IconButton>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export function Recipe(
    recipe: RecipeUnsaved,
    changeRecipeItemAmount: (idx: number) => (input: string, evaluated: number, isValid: boolean) => void,
    removeRecipeItem: (idx: number) => void,
    setName: (name: string) => void,
    saving: boolean,
    saveRecipe: () => void,
    clearRecipe: () => void
) {
    const [amount, setAmount] = useState<MathInputState>({input: '', evaluated: 0, isValid: true})

    const macros: DetailedMacros[] = recipe.ingredients.map((recipeItem) => multiply100gMacro(
        recipeItem.macros.baseMacros,
        recipeItem.macros.description,
        recipeItem.amount.evaluated * recipeItem.macros.amount,
        recipeItem.macros.portionSource
    ))

    const totalRecipeAmount = sum(recipe.ingredients.map((recipeItem) => recipeItem.amount.evaluated))
    const amountForTotalMacros = amount !== null ? amount : totalRecipeAmount

    const totalMacros = {
        amount: amountForTotalMacros,
        unit: recipe.unit,
        calories: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].calories!)),
        fat: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].fat!)),
        carbs: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].carbs!)),
        protein: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].protein!)),
        totalFiber: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].totalFiber!)),
        sugar: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].sugar!))
    }

    const amountForPer100: number = amount.evaluated || totalRecipeAmount
    const scalePerGram: number = 100 / amountForPer100

    const per100Macros = {
        amount: 100,
        unit: recipe.unit,
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
                        <TableCell align="right">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        recipe.ingredients.map(
                            (recipeItem, idx) => RecipeRow(
                                recipeItem,
                                macros[idx],
                                idx,
                                changeRecipeItemAmount(idx),
                                () => removeRecipeItem(idx)
                            )
                        )
                    }
                </TableBody>

                {recipe.ingredients.length > 0 &&
                <TableFooter>
                  <TableRow>
                    <TableCell align="left">Total</TableCell>
                    <TableCell
                      align="right">{MathInput(amount.input, amount.isValid, handleRecipeAmountChange)}</TableCell>
                    <TableCell align="right">{`${amount.evaluated} ${recipe.unit}`}</TableCell>
                    <TableCell align="right">{totalMacros.calories}</TableCell>
                    <TableCell align="right">{totalMacros.fat}</TableCell>
                    <TableCell align="right">{totalMacros.carbs}</TableCell>
                    <TableCell align="right">{totalMacros.protein}</TableCell>
                    <TableCell align="right">{totalMacros.totalFiber}</TableCell>
                    <TableCell align="right">{totalMacros.sugar}</TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Per 100</TableCell>
                    <TableCell align="right">100</TableCell>
                    <TableCell align="right">{`100 ${recipe.unit}`}</TableCell>
                    <TableCell align="right">{per100Macros.calories}</TableCell>
                    <TableCell align="right">{per100Macros.fat}</TableCell>
                    <TableCell align="right">{per100Macros.carbs}</TableCell>
                    <TableCell align="right">{per100Macros.protein}</TableCell>
                    <TableCell align="right">{per100Macros.totalFiber}</TableCell>
                    <TableCell align="right">{per100Macros.sugar}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>}
            </Table>
            <form onSubmit={saveRecipe}>
                <TextField
                    onChange={(e) => setName(e.target.value)}
                    type='text'
                    helperText='Recipe Name'
                    value={recipe.name.value}
                />
                <LoadingButton type='submit' loading={saving} loadingIndicator="Saving..." variant="outlined">
                    Save
                </LoadingButton>
            </form>
        </TableContainer>
    );
}
