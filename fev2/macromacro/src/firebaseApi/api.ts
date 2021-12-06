import {
    addDoc,
    collection,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    Timestamp,
    query
} from 'firebase/firestore';
import { CustomIngredient, CustomIngredientUnsaved } from "../classes";


const CUSTOM_INGREDIENTS_COLLECTION_NAME = 'customIngredients-v1';

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
        console.error('Error writing new message to Firebase Database', error);
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
                macros100g: data.macros100g,
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
