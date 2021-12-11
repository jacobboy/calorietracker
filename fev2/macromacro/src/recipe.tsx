import React, { FormEvent } from 'react';
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
    getCaloriePercents,
    MathInput,
    MathInputState,
    multiplyBaseMacro,
    per100MacrosForRecipe,
    round,
    sum,
    totalMacrosForRecipe
} from "./conversions";
import { IconButton, TableFooter, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import LoadingButton from '@mui/lab/LoadingButton';

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
                <TableCell align="right">{round(macros.dietaryFiber)}</TableCell>
                <TableCell align="right">{round(macros.solubleFiber)}</TableCell>
                <TableCell align="right">{round(macros.sugar)}</TableCell>
                <TableCell align="right">{round(macros.protein)}</TableCell>
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
    clearRecipe: () => void,
    setRecipeAmount: (amount: MathInputState) => void
) {

    const amountForTotalMacros = recipe.amount.evaluated || sum(recipe.ingredients.map((recipeItem) => recipeItem.amount.evaluated)) || 100
    const totalMacros = totalMacrosForRecipe(recipe, amountForTotalMacros);
    const per100Macros = per100MacrosForRecipe(amountForTotalMacros, recipe, totalMacros);
    const caloriePercents = getCaloriePercents(amountForTotalMacros, recipe, totalMacros);

    function handleRecipeAmountChange(input: string, evaluated: number, isValid: boolean) {
        setRecipeAmount({input, isValid, evaluated})
    }

    function handleSave(e: FormEvent<HTMLFormElement>) {
        saveRecipe()
        e.preventDefault()
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="recipe table">
                <caption>Recipe</caption>
                <TableHead>
                    <TableRow key='header'>
                        <TableCell align="left">Food</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Description</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat</TableCell>
                        <TableCell align="right">Carbs</TableCell>
                        <TableCell align="right">Dietary&nbsp;Fiber</TableCell>
                        <TableCell align="right">Soluble&nbsp;Fiber</TableCell>
                        <TableCell align="right">Sugars</TableCell>
                        <TableCell align="right">Protein&nbsp;</TableCell>
                        <TableCell align="right">Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        recipe.ingredients.map(
                            (recipeItem, idx) => RecipeRow(
                                recipeItem,
                                multiplyBaseMacro(
                                    recipeItem.macros.baseMacros,
                                    recipeItem.macros.description,
                                    recipeItem.amount.evaluated * recipeItem.macros.amount,
                                    recipeItem.macros.portionSource
                                ),
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
                      align="right">{MathInput(recipe.amount.input, recipe.amount.isValid, handleRecipeAmountChange)}</TableCell>
                    <TableCell align="right">{`${recipe.amount.evaluated} ${recipe.unit}`}</TableCell>
                    <TableCell align="right">{totalMacros.calories}</TableCell>
                    <TableCell align="right">{totalMacros.fat}</TableCell>
                    <TableCell align="right">{totalMacros.carbs}</TableCell>
                    <TableCell align="right">{totalMacros.dietaryFiber}</TableCell>
                    <TableCell align="right">{totalMacros.solubleFiber}</TableCell>
                    <TableCell align="right">{totalMacros.sugar}</TableCell>
                    <TableCell align="right">{totalMacros.protein}</TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Per 100</TableCell>
                    <TableCell align="right">100</TableCell>
                    <TableCell align="right">{`100 ${recipe.unit}`}</TableCell>
                    <TableCell align="right">{per100Macros.calories}</TableCell>
                    <TableCell align="right">{per100Macros.fat}</TableCell>
                    <TableCell align="right">{per100Macros.carbs}</TableCell>
                    <TableCell align="right">{per100Macros.dietaryFiber}</TableCell>
                    <TableCell align="right">{per100Macros.solubleFiber}</TableCell>
                    <TableCell align="right">{per100Macros.sugar}</TableCell>
                    <TableCell align="right">{per100Macros.protein}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>}
            </Table>
            <form onSubmit={handleSave}>
                <TextField
                    onChange={(e) => setName(e.target.value)}
                    type='text'
                    helperText='Recipe Name'
                    placeholder='Hell of recipe'
                    value={recipe.name.value}
                />
                <LoadingButton type='submit' loading={saving} loadingIndicator="Saving..." variant="outlined">
                    Save
                </LoadingButton>
            </form>
        </TableContainer>
    );
}
