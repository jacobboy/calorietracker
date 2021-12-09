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
import {
    CustomIngredient,
    CustomIngredientUnsaved,
    RecipeAndIngredient,
    RecipeUnsaved
} from "../classes";
import { per100MacrosForRecipe, totalMacrosForRecipe } from "../conversions";


const CUSTOM_INGREDIENTS_COLLECTION_NAME = 'customIngredients-v1';
const RECIPES_COLLECTION_NAME = 'recipes-v1';

type SavePrep<T> = Omit<T, 'id'>

function stripUndefined<T>(t: T): T {
    return JSON.parse(JSON.stringify(t)) as T
}

export async function persistCustomIngredient(ingredient: CustomIngredientUnsaved): Promise<CustomIngredient> {
    const toSave: SavePrep<CustomIngredient> = {
        ...stripUndefined(ingredient),
        timestamp: Timestamp.fromDate(new Date()),
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
                    data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000
                ),
                version: 'v1'
            }
        )
    })
    return customIngredients
}

function recipeUnsavedToRecipe(recipe: RecipeUnsaved): SavePrep<RecipeAndIngredient> {
    const totalMacros = totalMacrosForRecipe(recipe, recipe.amount.evaluated);
    const baseMacros = per100MacrosForRecipe(recipe.amount.evaluated, recipe, totalMacros)
    return {
        amount: recipe.amount.evaluated,
        unit: recipe.unit,
        ingredients: recipe.ingredients.map((i) => {
            return {
                ...i,
                amount: i.amount.evaluated
            }
        }),
        name: recipe.name.value,
        version: 'v1',
        baseMacros,
        portions: [{
            amount: baseMacros.amount,
            unit: baseMacros.unit,
            description: baseMacros.description
        }],
        timestamp: Timestamp.fromDate(new Date())
    }
}

export async function persistRecipe(recipe: RecipeUnsaved): Promise<RecipeAndIngredient> {
    // remove undefined values
    const toSave: SavePrep<RecipeAndIngredient> = {
        ...stripUndefined(recipeUnsavedToRecipe(recipe)),
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
