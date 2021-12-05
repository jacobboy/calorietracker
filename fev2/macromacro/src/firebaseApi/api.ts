import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    limit,
    onSnapshot,
    orderBy,
    query
} from 'firebase/firestore';
import { CustomIngredient, CustomIngredientUnsaved } from "../classes";

// let idx = 0
//
// export function persistCustomIngredient(ingredient: CustomIngredientUnsaved): CustomIngredient {
//     const id = idx.toString()
//     idx += 1
//     return {
//         ...ingredient,
//         id,
//         dateCreated: new Date()
//     }
// }


const CUSTOM_INGREDIENTS_COLLECTION_NAME = 'customIngredients-v1';

export async function persistCustomIngredient(ingredient: CustomIngredientUnsaved): Promise<CustomIngredient> {
    console.log('persistCustomIngredient')
    // remove undefined values
    const toSave: CustomIngredientUnsaved = JSON.parse(JSON.stringify(ingredient))
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
        console.error('Error writing new message to Firebase Database', error);
        throw error;
    }
}

export async function loadRecentlyCreatedCustomIngredients(): Promise<CustomIngredient[]> {
    // Create the query to load the last 12 messages and listen for new ones.
    const recentMessagesQuery = query(
        collection(getFirestore(), CUSTOM_INGREDIENTS_COLLECTION_NAME),
        orderBy('timestamp', 'desc'),
        limit(20)
    );

    const querySnapshot = await getDocs(recentMessagesQuery);

    const customIngredients: CustomIngredient[] = []
    querySnapshot.forEach((doc) => {
        console.log(doc.data())
        // customIngredients.push(doc.data())
    })
    return []
}
