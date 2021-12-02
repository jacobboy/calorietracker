import React, { ChangeEvent, useState } from "react";
import { DetailedMacros, Ingredient, Unit } from "./classes";
import { TextField } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';


const startIngredient = {
    name: 'One Slammin\' Ingredient',
    macros: {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0,
        totalFiber: 0,
        solubleFiber: 0,
        insolubleFiber: 0,
        sugar: 0,
        amount: 100,
        unit: Unit.g,
        description: '100 g',
    },
    portions: [{unit: Unit.g, amount: 100}],
    dateCreated: new Date()
}

export function CreateIngredient(createIngredient: (ingredient: Ingredient) => void) {
    const [ingredient, setIngredient] = useState<Ingredient>(startIngredient)
    const [saving, setSaving] = useState<boolean>(false)

    function updateMacroValue(
        field: keyof DetailedMacros
    ): (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void {
        return (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            try {
                const x = parseInt(e.target.value)
                setIngredient((prevState) => {
                    return {
                        ...prevState,
                        macros: {
                            ...prevState.macros,
                            [field]: x
                        }
                    }
                })
            } catch {

            }
        }
    }

    function handleName(name: string) {
        setIngredient((prevState) => {
            return {...prevState, name}
        })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        console.log('handling submit')
        setSaving(true)
        createIngredient({...ingredient, dateCreated: new Date()})
        setIngredient(startIngredient)
        setSaving(false)
        e.preventDefault()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <header>Create Ingredient</header>
                {/* TODO can't do decimals? */}
                <TextField
                    helperText={'Name'}
                    type='text'
                    value={ingredient.name}
                    onChange={e => handleName(e.target.value)}
                />
                <TextField
                    helperText='Calories'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.calories}
                    onChange={updateMacroValue('calories')}
                />
                <TextField
                    helperText='Carbs'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.carbs}
                    onChange={updateMacroValue('carbs')}
                />
                <TextField
                    helperText='Protein'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.protein}
                    onChange={updateMacroValue('protein')}
                />
                <TextField
                    helperText='Fat'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.fat}
                    onChange={updateMacroValue('fat')}
                />
                <TextField
                    helperText='Total Fiber'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.totalFiber}
                    onChange={updateMacroValue('totalFiber')}
                />
                <TextField
                    helperText='Soluble Fiber'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.solubleFiber}
                    onChange={updateMacroValue('solubleFiber')}
                />
                <TextField
                    helperText='Insoluble Fiber'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.insolubleFiber}
                    onChange={updateMacroValue('insolubleFiber')}
                />
                <TextField
                    helperText='Sugar'
                    type='number'
                    // TODO this max doesn't prevent them from typing in 12345
                    inputProps={{min: 0, max: 9999}}
                    value={ingredient.macros.sugar}
                    onChange={updateMacroValue('sugar')}
                />
                <LoadingButton type='submit' loading={saving} loadingIndicator="Saving..." variant="outlined">
                    Save
                </LoadingButton>
            </form>
        </div>
    );
}
