import { IngredientId, PortionMacros } from "./classes";
import { getMeasuresForOneFood } from "./calls";

const fdcPortionMacrosCache: Record<IngredientId, PortionMacros[]> = {}

// TODO i mean, thread safety questions?
async function getFood(id: IngredientId): Promise<PortionMacros[]> {
    if (typeof id === 'string') {
        if (!(id in fdcPortionMacrosCache)) {
            await getMeasuresForOneFood(id).then(
                (portionMacros) => {
                    fdcPortionMacrosCache[id] = portionMacros
                }
            )
        }
        return fdcPortionMacrosCache[id]
    } else {
        throw new Error('woopsies')
    }
}
