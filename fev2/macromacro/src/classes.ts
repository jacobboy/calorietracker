import { MathInputState } from "./conversions";

export enum Unit {
    g = 'g',
    ml = 'ml'
}

export type Source = 'portion' | '100g' | 'labelNutrients'

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
    source: Source,
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
    amount: MathInputState
}
