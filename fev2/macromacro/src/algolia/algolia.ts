import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { Hit } from '@algolia/client-search';
import {
    CustomIngredient,
    DBContentsV1,
    RecipeAndIngredient,
    RecipeAndIngredientDocV1,
    SearchResults
} from "../classes";
import { Timestamp } from "firebase/firestore";

const SEARCH_INDEX = 'ingredients-and-recipes-index'


export class AlgoliaClient {
    client: SearchClient
    index: SearchIndex

    constructor() {
        const client = algoliasearch(
            'MLU2K737QW',
            'c3e038f45e740de8901433faaff27dfe'
        );
        this.client = client
        this.index = client.initIndex(SEARCH_INDEX);
    }

    searchStuff(searchText: string): Promise<SearchResults> {
        return this.index.search<DBContentsV1>(searchText).then(
            (response) => {
                const searchResults: SearchResults = {
                    ingredients: [],
                    recipes: []
                }
                response.hits.forEach((data) => {
                    const [ingredient, recipe] = makeRecipeOrIngredient(data)
                    if (ingredient) {
                        searchResults.ingredients.push(ingredient)
                    }
                    if (recipe) {
                        searchResults.recipes.push(recipe)
                    }
                })
                return searchResults
            })
    }
}

function makeRecipeOrIngredient(data: Hit<DBContentsV1>): [CustomIngredient, undefined] | [undefined, RecipeAndIngredient] {
    const id = data.objectID
    if (isRecipe(data)) {
        const recipe: RecipeAndIngredient = {
            id: id,
            baseMacros: data.baseMacros,
            name: data.name,
            portions: data.portions,
            brandOwner: data.brandOwner,
            brandName: data.brandName,
            timestamp: Timestamp.fromMillis(
                data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000
            ),
            version: data.version,
            creator: data.creator,
            amount: data.amount,
            ingredients: data.ingredients,
            unit: data.unit,
            source: {
                dataSource: 'createRecipe',
                name: data.name,
                id: id
            }
        }
        return [undefined, recipe]
    } else {
        const ingredient: CustomIngredient = {
            id: id,
            baseMacros: data.baseMacros,
            name: data.name,
            portions: data.portions,
            brandOwner: data.brandOwner,
            brandName: data.brandName,
            timestamp: Timestamp.fromMillis(
                data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000
            ),
            version: data.version,
            creator: data.creator,
            source: {
                dataSource: 'createIngredient',
                name: data.name,
                id: id
            }
        }
        return [ingredient, undefined]
    }
}

function isRecipe(doc: DBContentsV1): doc is RecipeAndIngredientDocV1 {
    console.log(doc)
    // @ts-ignore
    const itIs = doc.ingredients !== undefined && doc.amount !== undefined
    console.log(itIs)
    return itIs
}

