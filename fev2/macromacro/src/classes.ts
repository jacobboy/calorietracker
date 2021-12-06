import { MathInputState } from "./conversions";
import { Timestamp } from "firebase/firestore";

export interface TextInputState {
    value: string,
    isValid: boolean
}

export enum Unit {
    g = 'g',
    ml = 'ml',
    cup = 'cup',
    lb = 'lb',
    oz = 'oz',
    flOz = 'fl oz'
}

export type PortionSource = { source: 'portion', id?: number } |
    { source: '100g' } |
    { source: 'labelNutrients' } |
    { source: 'g' } | { source: 'ml' }  // for created ingredients

export type Source = 'fdcApi' | 'createIngredient' | 'createRecipe'

export interface Quantity {
    unit: Unit,
    amount: number,
    description: string
}

export interface SimpleMacros extends Quantity {
    calories?: number,
    carbs?: number,
    fat?: number,
    protein?: number
}

export interface DetailedMacros extends SimpleMacros {
    totalFiber?: number,
    solubleFiber?: number,
    insolubleFiber?: number,
    sugar?: number,
}

/*
the unit on the portion macro needs to be compatible with the unit
on the detailed macros
*/
export interface PortionMacros extends DetailedMacros {
    dataProvenance: Source,
    portionSource: PortionSource,
    baseMacros: DetailedMacros
}


// TODO number for FDC foods, string for created ingredients
//      make it multiple classes?
export type IngredientId = string | number

export interface IngredientRowData extends SimpleMacros {
    dataType?: string,
    brandOwner?: string,
    brandName?: string,
    id: IngredientId,
    name: string,
    householdServingFullText?: string
}

export interface CustomIngredient {
    name: string,
    id: string,
    brandOwner?: string,
    brandName?: string,
    portions: Quantity[],
    macros100g: DetailedMacros,
    timestamp: Timestamp
}

export type CustomIngredientUnsaved = Omit<Omit<CustomIngredient, 'id'>, 'timestamp'>

export interface RecipeItemUnsaved {
    name: string,
    id: IngredientId,
    macros: PortionMacros,
    amount: MathInputState
}

export interface RecipeUnsaved {
    ingredients: RecipeItemUnsaved[],
    amount: MathInputState,
    unit: Unit,
    name: TextInputState,
    isValid: boolean
}

export interface RecipeItem {
    name: string,
    id: IngredientId,
    macros: PortionMacros,
    amount: number
 }

export interface Recipe {
    timestamp: Timestamp,
    id: string,
    ingredients: RecipeItem[],
    amount: number,
    unit: Unit,
    name: string
}
