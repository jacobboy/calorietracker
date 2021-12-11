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

export interface Saved {
    timestamp: Timestamp,
    id: string,
    name: string,
    version: string
}

export type PortionSource = { source: 'portion', id?: number } |
    { source: '100g' } |
    { source: 'labelNutrients' } |
    { source: 'g' } | { source: 'ml' }  // for created ingredients

export type IngredientSource = {
    dataSource: 'fdcApi',
    name: string,
    id: number
} | {
    dataSource: 'createIngredient',
    name: string,
    id: string
} | {
    dataSource: 'createRecipe',
    name: string,
    id: string
}

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
A portion containing amount and unit, its description and calculated macros, and a
reference to the base macros

the unit on the portion macro needs to be compatible with the unit
on the detailed macros
*/
export interface PortionMacros extends DetailedMacros {
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
    source: IngredientSource,
    householdServingFullText?: string
}

export interface CustomIngredient extends Saved {
    baseMacros: DetailedMacros,
    portions: Quantity[],
    brandOwner?: string,
    brandName?: string,
}

export interface CustomIngredientFromDB extends CustomIngredient {
    source: IngredientSource
}

export type CustomIngredientUnsaved = Omit<Omit<Omit<CustomIngredient, 'id'>, 'timestamp'>, 'version'>

export interface RecipeItemUnsaved {
    source: IngredientSource,
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
    source: IngredientSource,
    macros: PortionMacros,
    amount: number
 }

export interface Recipe extends Saved {
    ingredients: RecipeItem[],
    amount: number,
    unit: Unit,
}

export type RecipeAndIngredient = Recipe & CustomIngredient
