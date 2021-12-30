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
    version: string,
    creator: string,
    // TODO id and name in IngredientSource are redundant now
    source: IngredientSource
}

export type PortionSource = { source: 'portion', id?: number } |
    { source: '100g' } |
    { source: 'labelNutrients' } |
    { source: 'g' } | { source: 'ml' }  // for created ingredients

type FDCSource = {
    dataSource: 'fdcApi',
    name: string,
    id: number
}

type CreateIngredientSource = {
    dataSource: 'createIngredient',
    name: string,
    id: string
}

type CreateRecipeSource = {
    dataSource: 'createRecipe',
    name: string,
    id: string
}

export type IngredientSource = FDCSource | CreateIngredientSource | CreateRecipeSource

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
    solubleFiber?: number,
    dietaryFiber?: number,
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

export interface CustomIngredientUnsaved {
    name: string,
    baseMacros: DetailedMacros,
    portions: Quantity[],
    brandOwner?: string,
    brandName?: string,
}

export interface CustomIngredient extends CustomIngredientUnsaved, Saved {
    source: CreateIngredientSource
}

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
    name: string,
    ingredients: RecipeItem[],
    amount: number,
    unit: Unit,
    source: CreateRecipeSource
}

export interface RecipeAndIngredient extends Omit<Recipe & CustomIngredient, 'source'> {
    source: CreateRecipeSource
}

export interface SearchResults {
    ingredients: CustomIngredient[]
    recipes: RecipeAndIngredient[]
}

export type SavePrep<T> = Omit<Omit<T, 'id'>, 'source'>

export interface CustomIngredientDocV1 extends SavePrep<CustomIngredient> {
    type: 'ingredient'
}

export interface RecipeAndIngredientDocV1 extends SavePrep<RecipeAndIngredient> {
    type: 'recipe'
}

export type DBContentsV1 = CustomIngredientDocV1 | RecipeAndIngredientDocV1
