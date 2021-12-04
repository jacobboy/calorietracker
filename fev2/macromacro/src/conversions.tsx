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
import { DetailedMacros, PortionMacros, SimpleMacros, PortionSource, Unit } from "./classes";
import { macrosMap, simpleMacrosMap } from "./mappings";


export function scaleUpOrUndefined(scale: number, x?: number): number | undefined {
    return x !== undefined ? x * scale : undefined
}

/*
TODO this should take the incoming unit and raise an error if it can't be converted
     also, base macros may not be grams
*/
export function multiply100gMacro(
    macros100g: DetailedMacros,
    description: string,
    amount: number,
    source: PortionSource
): Omit<PortionMacros, 'dataProvenance'> {
    const scalePerGram = amount / macros100g.amount
    return {
        calories: scaleUpOrUndefined(scalePerGram, macros100g.calories),
        carbs: scaleUpOrUndefined(scalePerGram, macros100g.carbs),
        protein: scaleUpOrUndefined(scalePerGram, macros100g.protein),
        fat: scaleUpOrUndefined(scalePerGram, macros100g.fat),
        totalFiber: scaleUpOrUndefined(scalePerGram, macros100g.totalFiber),
        sugar: scaleUpOrUndefined(scalePerGram, macros100g.sugar),
        amount: amount,
        unit: macros100g.unit,
        description: description,
        baseMacros: macros100g,
        portionSource: source
    }
}

export function getPortionMacrosForMeasures(
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

            const portionMacro: PortionMacros = {
                dataProvenance: 'fdcApi',
                ...multiply100gMacro(macros100g, description, gramWeight, {source: 'portion', id: foodPortion.id})
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
                totalFiber: foodItem.labelNutrients?.fiber?.value,
                sugar: foodItem.labelNutrients?.sugars?.value,
                amount: foodItem.servingSize || 0,
                unit: Unit[((foodItem.servingSizeUnit || 'g') as keyof typeof Unit)],
                description: foodItem.householdServingFullText || `${foodItem.servingSize || 'not set'} ${foodItem.servingSizeUnit || 'not set'}`,
                portionSource: {source: 'labelNutrients'},
                baseMacros: macros100g,
                dataProvenance: "fdcApi"
            }
        )
    }

    return [{...macros100g, baseMacros: macros100g, portionSource: {source: '100g'}, dataProvenance: "fdcApi"}, ...portions];
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
