import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { CustomIngredient } from "../classes";
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

    searchStuff(searchText: string): Promise<CustomIngredient[]> {
        return this.index.search<CustomIngredient>(searchText).then((response) => {
            return response.hits.map((data) => {
                return                     {
                    id: data.objectID,
                    baseMacros: data.baseMacros,
                    name: data.name,
                    portions: data.portions,
                    brandOwner: data.brandOwner,
                    brandName: data.brandName,
                    timestamp: Timestamp.fromMillis(
                        data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000
                    ),
                    version: data.version,
                    creator: data.creator
                }
            })
        })

    }

}
