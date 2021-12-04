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
I think this is the minimum needed for sharing between ingredients
and recipe
*/
export interface PortionAmountReference {
    ingredientReference: {
        dataProvenance: Source,
        id: IngredientId
    },
    portionReference: PortionSource,
    portion: PortionSource,
    amount: number
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

export interface RecipeItem {
    name: string,
    id: IngredientId,
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

export interface CustomIngredient {
    name: string,
    id: string,
    brandOwner?: string,
    brandName?: string,
    portions: Quantity[],
    dateCreated: Date,
    macros100g: DetailedMacros,
}

