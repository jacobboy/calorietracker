import { PortionAmountReference, PortionMacros } from "./classes";

export interface IngredientContext {
    hydratePortionAmountReference: (portionAmountReference: PortionAmountReference) => PortionMacros
}
