import { MathInputState } from "./conversions";

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

export interface SimpleMacros {
    calories?: number,
    carbs?: number,
    fat?: number,
    protein?: number
    amount: number,
    unit: Unit,
    description: string
}

export interface DetailedMacros extends SimpleMacros {
    totalFiber?: number,
    solubleFiber?: number,
    insolubleFiber?: number,
    sugar?: number,
}

export interface PortionMacros extends DetailedMacros {
    dataProvenance: Source,
    portionSource: PortionSource,
    baseMacros: DetailedMacros
}

export interface RowData extends SimpleMacros {
    dataType?: string,
    brandOwner?: string,
    brandName?: string,
    fdcId: number,
    name: string,
    householdServingFullText?: string
}

export interface RecipeItem {
    name: string,
    id: number,
    macros: PortionMacros,
    amount: MathInputState
}

export interface Recipe {
    date: Date,
    uuid: string,
    ingredients: RecipeItem[],
    amount: MathInputState,
    unit: Unit
}

export interface IngredientPortion {
    unit: Unit,
    amount: number
}

export interface Ingredient {
    name: string,
    macros: DetailedMacros,
    portions: IngredientPortion[],
    dateCreated: Date
}

