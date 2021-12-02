import { MathInputState } from "./conversions";

export enum Unit {
    g = 'g',
    ml = 'ml',
    cup = 'cup',
    lb = 'lb',
    oz = 'oz',
    flOz = 'fl oz'
}

export type PortionSource = 'portion' | '100g' | 'labelNutrients'

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
    // solubleFiber?: number,
    // insolubleFiber?: number,
    sugar?: number,
}

export interface PortionMacros extends DetailedMacros {
    source: PortionSource,
    /*
    if source is 'portion', id indicates the portion id
    */
    id?: number,
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
    fdcId: number,
    macros: PortionMacros,
    amount: MathInputState,
    source: Source
}

export interface Recipe {
    date: Date,
    uuid: string,
    ingredients: RecipeItem[],
    amount: MathInputState,
    unit: Unit
}

export interface CreatedIngredient extends DetailedMacros {

}
