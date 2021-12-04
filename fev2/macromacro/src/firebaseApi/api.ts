import { CustomIngredientBuilder } from "../createIngredient";
import { CustomIngredient } from "../classes";

let idx = 0

export function persistCustomIngredient(ingredient: CustomIngredientBuilder): CustomIngredient {
    const id = idx.toString()
    idx += 1
    return {
        ...ingredient,
        macros100g: ingredient.macros,
        id
    }
}
