import {
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    Timestamp,
    where
} from 'firebase/firestore';
import {
    CustomIngredient,
    CustomIngredientUnsaved,
    RecipeAndIngredient,
    RecipeUnsaved
} from "../classes";
import { per100MacrosForRecipe, totalMacrosForRecipe } from "../conversions";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut, User } from 'firebase/auth';

const CUSTOM_INGREDIENTS_COLLECTION_NAME = 'customIngredients-v3';
const RECIPES_COLLECTION_NAME = 'recipes-v3';

type SavePrep<T> = Omit<T, 'id'>

function stripUndefined<T>(t: T): T {
    return JSON.parse(JSON.stringify(t)) as T
}

export class FirebaseAPI {

    customIngredientCollectionName: string
    recipesCollectionName: string

    constructor(
        customIngredientCollectionName: string = CUSTOM_INGREDIENTS_COLLECTION_NAME,
        recipesCollectionName: string = RECIPES_COLLECTION_NAME
    ) {
        this.customIngredientCollectionName = customIngredientCollectionName
        this.recipesCollectionName = recipesCollectionName
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
                creator: uid
            }
            try {
                const messageRef = await addDoc(
                    collection(getFirestore(), this.customIngredientCollectionName),
                    toSave
                );
                return {
                    ...toSave,
                    id: messageRef.id
                }
            } catch (error) {
                console.error('Error writing ingredient to Firebase Database', error);
                throw error;
            }
        } else {
            throw new Error('not authorized')
        }
    }

    async loadRecentlyCreatedCustomIngredients(): Promise<CustomIngredient[]> {
        const uid = this.getUserUid()
        if (uid) {
            const recentMessagesQuery = query(
                collection(getFirestore(), this.customIngredientCollectionName),
                where("creator", "==", uid),
                orderBy('timestamp', 'desc'),
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
                        version: 'v1',
                        creator: data.creator
                    }
                )
            })
            return customIngredients
        } else {
            throw new Error('not authorized')
        }
    }

    async loadRecentlyCreatedRecipes(): Promise<CustomIngredient[]> {
        const uid = this.getUserUid()
        if (uid) {
            const recentMessagesQuery = query(
                collection(getFirestore(), this.recipesCollectionName),
                where("creator", "==", uid),
                orderBy('timestamp', 'desc'),
                limit(20)
            );

            const querySnapshot = await getDocs(recentMessagesQuery);

            const recipes: CustomIngredient[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                recipes.push(
                    {
                        id: doc.id,
                        baseMacros: data.baseMacros,
                        name: data.name,
                        portions: data.portions,
                        timestamp: Timestamp.fromMillis(
                            data.timestamp.seconds * 1000 + data.timestamp.nanoseconds / 1000000
                        ),
                        version: 'v1',
                        creator: uid
                    }
                )
            })
            return recipes
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
                ...stripUndefined(this.recipeUnsavedToRecipe(recipe, uid)),
            }

            try {
                const messageRef = await addDoc(
                    collection(getFirestore(), this.recipesCollectionName),
                    toSave
                );
                return {
                    ...toSave,
                    id: messageRef.id
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
            getFirestore(), this.customIngredientCollectionName
        )
        const deleteRecipesCollection = deleteCollection(
            getFirestore(), this.recipesCollectionName
        )
        await deleteIngredientCollection
        await deleteRecipesCollection
    }

    async signIn() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        await signInWithRedirect(auth, provider);
    }

    private onUser(callBack: (user: User | null) => void): void {
        onAuthStateChanged(getAuth(), callBack);
        // (user) => {
        //     if (user) {
        //         // User is signed in, see docs for a list of available properties
        //         // https://firebase.google.com/docs/reference/js/firebase.User
        //         return user.uid;
        //         // ...
        //     } else {
        //         return undefined
        //     }
        // }
    }

    isUserSignedIn() {
        const user = getAuth().currentUser
        console.log(user)
        return !!user;
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
