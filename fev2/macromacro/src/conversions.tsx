import { ChangeEvent } from 'react';
import './App.css';
import {
    AbridgedFoodNutrient,
    BrandedFoodItem,
    FoundationFoodItem,
    SRLegacyFoodItem,
    SurveyFoodItem
} from "./usda";
import { TextField } from "@mui/material";
import { Parser } from "expr-eval";
import {
    DetailedMacros,
    PortionMacros,
    SimpleMacros,
    PortionSource,
    Unit,
    RecipeUnsaved
} from "./classes";
import { macrosMap, simpleMacrosMap } from "./mappings";


export function scaleUpOrUndefined(scale: number, x?: number): number | undefined {
    return x !== undefined ? x * scale : undefined
}

/*
TODO this should take the incoming unit and raise an error if it can't be converted
     also, base macros may not be grams
*/
export function multiplyBaseMacro(
    baseMacros: DetailedMacros,
    description: string,
    amount: number,
    source: PortionSource
): PortionMacros {
    const scalePerGram = amount / baseMacros.amount
    return {
        calories: scaleUpOrUndefined(scalePerGram, baseMacros.calories),
        fat: scaleUpOrUndefined(scalePerGram, baseMacros.fat),
        carbs: scaleUpOrUndefined(scalePerGram, baseMacros.carbs),
        dietaryFiber: scaleUpOrUndefined(scalePerGram, baseMacros.dietaryFiber),
        solubleFiber: scaleUpOrUndefined(scalePerGram, baseMacros.solubleFiber),
        sugar: scaleUpOrUndefined(scalePerGram, baseMacros.sugar),
        protein: scaleUpOrUndefined(scalePerGram, baseMacros.protein),
        amount: amount,
        unit: baseMacros.unit,
        description: description,
        baseMacros: baseMacros,
        portionSource: source
    }
}

export function getPortionMacrosForMeasures(
    foodItem: BrandedFoodItem | FoundationFoodItem | SRLegacyFoodItem | SurveyFoodItem
): PortionMacros[] {
    const baseMacros: DetailedMacros = {
        amount: 100,
        unit: Unit.g,
        description: '100 g',
    };

    (foodItem.foodNutrients || []).forEach((nutrient) => {
        (Object.entries(macrosMap) as [keyof typeof macrosMap, string][]).forEach(
            ([field, nutrientNumber]) => {
                if (nutrient.nutrient?.number === nutrientNumber) {
                    baseMacros[field] = nutrient.amount
                }
            }
        )
    })

    const portions: PortionMacros[] = []
    if ('foodPortions' in foodItem && foodItem.foodPortions) {
        foodItem.foodPortions.forEach((foodPortion) => {
            let description;
            // foundation foods have measure units?
            if (foodPortion.measureUnit?.name && foodPortion.measureUnit.name !== 'undetermined') {
                // this all works for https://fdc.nal.usda.gov/fdc-app.html#/food-details/748967/nutrients
                description = [
                    foodPortion.amount,
                    foodPortion.measureUnit?.name,
                    foodPortion.portionDescription
                ].filter((x) => (x !== undefined) && (x !== 'undetermined') )
                    .join(' ') + (foodPortion.modifier ? `, ${foodPortion.modifier}` : '')
            } else {
                description = foodPortion.portionDescription || 'not set'
            }

            // 0 so i can see in the UI when this was missing
            const gramWeight = foodPortion.gramWeight || 0

            const portionMacro: PortionMacros = {
                ...multiplyBaseMacro(baseMacros, description, gramWeight, {source: 'portion', id: foodPortion.id})
            }

            portions.push(portionMacro)
        })
    }
    // branded
    if ('labelNutrients' in foodItem) {
        portions.push(
            {
                calories: foodItem.labelNutrients?.calories?.value,
                carbs: foodItem.labelNutrients?.carbohydrates?.value,
                fat: foodItem.labelNutrients?.fat?.value,
                protein: foodItem.labelNutrients?.protein?.value,
                sugar: foodItem.labelNutrients?.sugars?.value,
                amount: foodItem.servingSize || 0,
                unit: Unit[((foodItem.servingSizeUnit || 'g') as keyof typeof Unit)],
                description: foodItem.householdServingFullText || `${foodItem.servingSize || 'not set'} ${foodItem.servingSizeUnit || 'not set'}`,
                portionSource: {source: 'labelNutrients'},
                baseMacros: baseMacros
            }
        )
    }

    return [{...baseMacros, baseMacros: baseMacros, portionSource: {source: '100g'}}, ...portions];
}

export function getMacros(foodNutrients: AbridgedFoodNutrient[]): SimpleMacros {
    const macros: SimpleMacros = {
        unit: Unit.g,
        amount: 100,
        description: '100 g'
    }

    foodNutrients.forEach((nutrient) => {
        (Object.entries(simpleMacrosMap) as [keyof typeof simpleMacrosMap, string][]).forEach(
            ([field, nutrientNumber]) => {
                if (nutrient.nutrientNumber === nutrientNumber) {
                    macros[field] = nutrient.value
                }
            })
    })

    return macros;
}

export function round(x?: number) {
    return x !== undefined ? Math.round(x * 10) / 10 : x
}

export interface MathInputState {
    input: string,
    isValid: boolean,
    evaluated: number
}

export function MathInput(
    value: string,
    isValid: boolean,
    onChange: (input: string, evaluated: number, isValid: boolean) => void
) {
    function handleChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        try {
            const evaluated = Parser.evaluate(event.target.value)
            onChange(event.target.value, evaluated, true)
        } catch (error) {
            onChange(event.target.value, 0, false)
        }
    }

    return <TextField
        error={!isValid}
        value={value}
        placeholder="37 * 2 / 3"
        onChange={handleChange}
    />
}

export function sum(xs: number[]): number | undefined {
    const allUndefined = xs.every((x) => x === undefined)
    if (allUndefined) {
        return undefined
    }
    const rounded = round(xs.reduce((a, b) => (a || 0) + (b || 0), 0))
    // it won't be undefined under current behavior of round, just make the compiler happy
    return rounded !== undefined ? rounded : 0
}

export function totalMacrosForRecipe(recipe: RecipeUnsaved): Omit<DetailedMacros, 'amount'> {
    const macros: DetailedMacros[] = recipe.ingredients.map((recipeItem) => multiplyBaseMacro(
        recipeItem.macros.baseMacros,
        recipeItem.macros.description,
        recipeItem.amount.evaluated * recipeItem.macros.amount,
        recipeItem.macros.portionSource
    ))
    const totalMacros = {
        description: 'total',
        unit: recipe.unit,
        calories: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].calories!)),
        fat: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].fat!)),
        carbs: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].carbs!)),
        dietaryFiber: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].dietaryFiber!)),
        solubleFiber: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].solubleFiber!)),
        sugar: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].sugar!)),
        protein: sum(recipe.ingredients.map((recipeItem, idx) => macros[idx].protein!))
    }
    return totalMacros;
}

export function per100MacrosForRecipe(
    amount: number | undefined,
    recipe: RecipeUnsaved,
    totalMacros: Omit<DetailedMacros, 'amount'>,
): DetailedMacros {
    const per100Quantity = {description: `per 100 ${recipe.unit}`, amount: 100, unit: recipe.unit}
    if (amount === undefined) {
        return per100Quantity
    } else {
        const amountForPer100: number = amount
        const scalePerGram: number = 100 / amountForPer100

        const per100Macros = {
            ...per100Quantity,
            calories: round(scaleUpOrUndefined(scalePerGram, totalMacros.calories)),
            fat: round(scaleUpOrUndefined(scalePerGram, totalMacros.fat)),
            carbs: round(scaleUpOrUndefined(scalePerGram, totalMacros.carbs)),
            dietaryFiber: round(scaleUpOrUndefined(scalePerGram, totalMacros.dietaryFiber)),
            solubleFiber: round(scaleUpOrUndefined(scalePerGram, totalMacros.solubleFiber)),
            sugar: round(scaleUpOrUndefined(scalePerGram, totalMacros.sugar)),
            protein: round(scaleUpOrUndefined(scalePerGram, totalMacros.protein)),
        }
        return per100Macros;
    }
}

export function getCaloriePercents(
    macroAmounts: {fat?: number, carbs?: number, dietaryFiber?: number, protein?: number}
): {fat: number, carbs: number, protein: number} | {fat: undefined, carbs: undefined, protein: undefined} {
    if (
        [
            macroAmounts.fat,
            macroAmounts.carbs,
            macroAmounts.dietaryFiber,
            macroAmounts.protein
        ].every((x) => x !== undefined)
    ) {
        const fatCalories = macroAmounts.fat! * 9
        const carbCalories = (macroAmounts.carbs! - macroAmounts.dietaryFiber!) * 4
        const proteinCalories = macroAmounts.protein! * 4
        const totalCalories = fatCalories + carbCalories + proteinCalories

        return {
            fat: 100 * (fatCalories / totalCalories),
            carbs: 100 * (carbCalories / totalCalories),
            protein: 100 * (proteinCalories / totalCalories)
        }
    } else {
        return {fat: undefined, carbs: undefined, protein: undefined}
    }
}
