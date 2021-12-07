import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    Timestamp
} from 'firebase/firestore';
import { CustomIngredient, CustomIngredientUnsaved, Recipe, RecipeUnsaved } from "../classes";


const CUSTOM_INGREDIENTS_COLLECTION_NAME = 'customIngredients-v1';
const RECIPES_COLLECTION_NAME = 'recipes-v1';

export async function persistCustomIngredient(ingredient: CustomIngredientUnsaved): Promise<CustomIngredient> {
    // remove undefined values
    const toSave = {
        ...JSON.parse(JSON.stringify(ingredient)),
        timestamp: Timestamp.fromDate(new Date()),
        // timestamp: serverTimeStamp(),
        version: 'v1'
    }
    try {
        const messageRef = await addDoc(
            collection(getFirestore(), CUSTOM_INGREDIENTS_COLLECTION_NAME),
            toSave
        );
        return {
            ...toSave,
            id: messageRef.id
        }
    }
    catch(error) {
        console.error('Error writing ingredient to Firebase Database', error);
        throw error;
    }
}

export async function loadRecentlyCreatedCustomIngredients(): Promise<CustomIngredient[]> {

    const recentMessagesQuery = query(
        collection(getFirestore(), CUSTOM_INGREDIENTS_COLLECTION_NAME),
        orderBy('timestamp', 'asc'),
        limit(20)
    );

    const querySnapshot = await getDocs(recentMessagesQuery);

    const customIngredients: CustomIngredient[] = []
    querySnapshot.forEach((doc) => {
        const data = doc.data()
        customIngredients.push(
            {
                id: doc.id,
                baseMacros: data.baseMacros,
                name: data.name,
                portions: data.portions,
                brandOwner: data.brandOwner,
                brandName: data.brandName,
                timestamp: Timestamp.fromMillis(
                    data.timestamp.seconds * 1000 + data.timestamp.nanoseconds * 1000000
                )
            }
        )
    })
    return customIngredients
}

function recipeUnsavedToRecipe(recipe: RecipeUnsaved): Omit<Omit<Recipe, 'id'>, 'timestamp'> {
    return {
        ...recipe,
        ingredients: recipe.ingredients.map((i) => {
            return {
                ...i,
                amount: i.amount.evaluated
            }
        }),
        amount: recipe.amount.evaluated,
        name: recipe.name.value
    }
}

export async function persistRecipe(recipe: RecipeUnsaved): Promise<Recipe> {
    // remove undefined values
    const toSave = {
        ...JSON.parse(JSON.stringify(recipeUnsavedToRecipe(recipe))),
        timestamp: Timestamp.fromDate(new Date()),
        version: 'v1'
    }

    try {
        const messageRef = await addDoc(
            collection(getFirestore(), RECIPES_COLLECTION_NAME),
            toSave
        );
        return {
            ...toSave,
            id: messageRef.id
        }
    }
    catch(error) {
        console.error('Error writing recipe to Firebase Database', error);
        throw error;
    }

}
