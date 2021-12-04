import { Configuration, FDCApi } from "./usda";
import { IngredientId, PortionMacros } from "./classes";
import { getPortionMacrosForMeasures } from "./conversions";

export function getApiClient(): FDCApi {
    const config = new Configuration({
        apiKey: 'bu776D0hQ8ZBGC3g1eoUB3iNwknI6MJhNo1xzwRh',
        baseOptions: {
            withCredentials: false
        }
    })
    return new FDCApi(config);
}

export function getMeasuresForOneFood(id: IngredientId): Promise<PortionMacros[]> {
    const api = getApiClient()
    return api.getFullFood(id.toString()).then(
        (response) => {
            if (response.data) {
                return getPortionMacrosForMeasures(response.data)
            } else {
                throw new Error('got a woopsies')
            }
        }
    )
}

