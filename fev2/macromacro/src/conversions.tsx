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
import { DetailedMacros, PortionMacros, SimpleMacros, Source, Unit } from "./classes";
import { macrosMap, simpleMacrosMap } from "./mappings";


export function multiply100gMacro(
    macros100g: DetailedMacros,
    description: string,
    amount: number,
    source: Source,
    id?: number
): PortionMacros {
    const scalePerGram = amount / macros100g.amount
    return {
        calories: macros100g.calories !== undefined ? macros100g.calories * scalePerGram : undefined,
        carbs: macros100g.carbs !== undefined ? macros100g.carbs * scalePerGram : undefined,
        protein: macros100g.protein !== undefined ? macros100g.protein * scalePerGram : undefined,
        fat: macros100g.fat !== undefined ? macros100g.fat * scalePerGram : undefined,
        totalFiber: macros100g.totalFiber !== undefined ? macros100g.totalFiber * scalePerGram : undefined,
        sugar: macros100g.sugar !== undefined ? macros100g.sugar * scalePerGram : undefined,
        amount: amount,
        unit: macros100g.unit,
        description: description,
        baseMacros: macros100g,
        source,
        id
    }
}

export function getDetailedMacrosForMeasures(
    foodItem: BrandedFoodItem | FoundationFoodItem | SRLegacyFoodItem | SurveyFoodItem
): PortionMacros[] {
    const macros100g: DetailedMacros = {
        amount: 100,
        unit: Unit.g,
        description: '100 g',
    };

    (foodItem.foodNutrients || []).forEach((nutrient) => {
        (Object.entries(macrosMap) as [keyof typeof macrosMap, string][]).forEach(
            ([field, nutrientNumber]) => {
                if (nutrient.nutrient?.number === nutrientNumber) {
                    macros100g[field] = nutrient.amount
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
                description = `${foodPortion.measureUnit?.name} ${foodPortion.portionDescription || 'not set'}`
            } else {
                description = foodPortion.portionDescription || 'not set'
            }

            // 0 so i can see in the UI when this was missing
            const gramWeight = foodPortion.gramWeight || 0

            portions.push(multiply100gMacro(macros100g, description, gramWeight, 'portion', foodPortion.id))
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
                totalFiber: foodItem.labelNutrients?.fiber?.value,
                sugar: foodItem.labelNutrients?.sugars?.value,
                amount: foodItem.servingSize || 0,
                unit: Unit[((foodItem.servingSizeUnit || 'g') as keyof typeof Unit)],
                description: foodItem.householdServingFullText || `${foodItem.servingSize || 'not set'} ${foodItem.servingSizeUnit || 'not set'}`,
                source: 'labelNutrients',
                baseMacros: macros100g
            }
        )
    }

    return [{...macros100g, baseMacros: macros100g, source: '100g'}, ...portions];
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
