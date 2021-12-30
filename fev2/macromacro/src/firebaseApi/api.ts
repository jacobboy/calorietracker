import {
    addDoc,
    collection,
    deleteDoc,
    DocumentData,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    QueryDocumentSnapshot,
    Timestamp,
    where
} from 'firebase/firestore';
import {
    CustomIngredient,
    CustomIngredientDocV1,
    CustomIngredientUnsaved,
    RecipeAndIngredient,
    RecipeAndIngredientDocV1,
    RecipeUnsaved,
    SavePrep,
    SearchResults
} from "../classes";
import { per100MacrosForRecipe, totalMacrosForRecipe } from "../conversions";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
    signOut,
    User
} from 'firebase/auth';

const INGREDIENTS_INGREDIENTS_RECIPES_COLLECTION_NAME = 'ingredients-and-recipes';


function stripUndefined<T>(t: T): T {
    return JSON.parse(JSON.stringify(t)) as T
}

function isRecipe(doc: DocumentData): doc is RecipeAndIngredientDocV1 {
    // @ts-ignore
    return doc.ingredients !== undefined && doc.amount !== undefined
}

function makeRecipeOrIngredient(doc: QueryDocumentSnapshot<DocumentData>): [CustomIngredient, undefined] | [undefined, RecipeAndIngredient] {
    const id = doc.id
    const data = doc.data()
    if (isRecipe(doc)) {
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

export class FirebaseAPI {
    ingredientsAndRecipesCollectionName: string
    constructor(
        ingredientsAndRecipesCollectionName: string = INGREDIENTS_INGREDIENTS_RECIPES_COLLECTION_NAME,
    ) {
        this.ingredientsAndRecipesCollectionName = ingredientsAndRecipesCollectionName
    }

    registerAuthCallback(authCallback: (user: User | null) => void) {
        onAuthStateChanged(getAuth(), authCallback)
    }

    async persistCustomIngredient(ingredient: CustomIngredientUnsaved): Promise<CustomIngredient> {
        const uid = this.getUserUid()
        if (uid) {
            const toSave: SavePrep<CustomIngredient> = {
                ...stripUndefined(ingredient),
                timestamp: Timestamp.fromDate(new Date()),
                version: 'v1',
                creator: uid,
            }
            try {
                const doc: CustomIngredientDocV1 = {...toSave, type: 'ingredient'}
                const messageRef = await addDoc(
                    collection(getFirestore(), this.ingredientsAndRecipesCollectionName),
                    doc
                );
                return {
                    ...toSave,
                    id: messageRef.id,
                    source: {
                        dataSource: 'createIngredient',
                        name: toSave.name,
                        id: messageRef.id
                    }
                }
            } catch (error) {
                console.error('Error writing ingredient to Firebase Database', error);
                throw error;
            }
        } else {
            throw new Error('not authorized')
        }
    }

    async loadRecentlyCreatedCustomIngredients(): Promise<SearchResults> {
        const uid = this.getUserUid()
        if (uid) {
            const recentMessagesQuery = query(
                collection(getFirestore(), this.ingredientsAndRecipesCollectionName),
                where("creator", "==", uid),
                where("type", "==", 'ingredient'),
                orderBy('timestamp', 'desc'),
                limit(20)
            );

            const querySnapshot = await getDocs(recentMessagesQuery);

            const searchResults: SearchResults = {
                ingredients: [],
                recipes: []
            }
            querySnapshot.forEach((doc) => {
                const [ingredient, recipe] = makeRecipeOrIngredient(doc)
                if (ingredient) {
                    searchResults.ingredients.push(
                        ingredient
                    )
                }
                if (recipe) {
                    searchResults.recipes.push(recipe)
                }
            })
            return searchResults
        } else {
            throw new Error('not authorized')
        }
    }

    recipeUnsavedToRecipe(recipe: RecipeUnsaved, uid: string): SavePrep<RecipeAndIngredient> {
        const totalMacros = { ...totalMacrosForRecipe(recipe), amount: recipe.amount.evaluated };
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
            timestamp: Timestamp.fromDate(new Date()),
            creator: uid
        }
    }

    async persistRecipe(recipe: RecipeUnsaved): Promise<RecipeAndIngredient> {
        const uid = this.getUserUid()
        if (uid) {
            // remove undefined values
            const toSave: SavePrep<RecipeAndIngredient> = {
                ...stripUndefined(this.recipeUnsavedToRecipe(recipe, uid))
            }

            try {
                const doc: RecipeAndIngredientDocV1 = {...toSave, type: 'recipe'}
                const messageRef = await addDoc(
                    collection(getFirestore(), this.ingredientsAndRecipesCollectionName),
                    doc
                );
                return {
                    ...toSave,
                    id: messageRef.id,
                    source: {
                        dataSource: 'createRecipe',
                        name: toSave.name,
                        id: messageRef.id
                    }
                }
            } catch (error) {
                console.error('Error writing recipe to Firebase Database', error);
                throw error;
            }
        } else {
            throw new Error('not authorized')
        }
    }

    async deleteCollections() {
        const deleteIngredientCollection = deleteCollection(
            getFirestore(), this.ingredientsAndRecipesCollectionName
        )
        await deleteIngredientCollection
    }

    async signIn() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        await signInWithRedirect(auth, provider);
    }

    getUserUid(): string | undefined {
        return getAuth().currentUser?.uid
    }

    signOut() {
        signOut(getAuth());
    }
}

// from https://cloud.google.com/firestore/docs/samples/firestore-data-delete-collection#firestore_data_delete_collection-nodejs
// @ts-ignore
async function deleteCollection(db, collectionPath) {
    const q = query(
        collection(getFirestore(), collectionPath),
        orderBy('__name__'),
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
    });

}
