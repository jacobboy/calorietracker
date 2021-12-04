import { addDoc, collection, getFirestore, } from 'firebase/firestore';
import { CustomIngredient, CustomIngredientUnsaved } from "../classes";

let idx = 0

export function persistCustomIngredient(ingredient: CustomIngredientUnsaved): CustomIngredient {
    const id = idx.toString()
    idx += 1
    return {
        ...ingredient,
        id,
        dateCreated: new Date()
    }
}


// Saves a new message on the Cloud Firestore.
async function saveMessage(ingredient: CustomIngredientUnsaved): Promise<CustomIngredient> {
    // Add a new message entry to the Firebase database.
    const toSave = {...ingredient, dateCreated: new Date()}
    try {
        const messageRef = await addDoc(
            collection(getFirestore(), 'customIngredients-v1'),
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

// Loads chat messages history and listens for upcoming ones.
// function loadMessages() {
//     // Create the query to load the last 12 messages and listen for new ones.
//     const recentMessagesQuery = query(collection(getFirestore(), 'messages'), orderBy('timestamp', 'desc'), limit(12));
//
//     // Start listening to the query.
//     onSnapshot(recentMessagesQuery, function(snapshot) {
//         snapshot.docChanges().forEach(function(change) {
//             if (change.type === 'removed') {
//                 deleteMessage(change.doc.id);
//             } else {
//                 var message = change.doc.data();
//                 displayMessage(change.doc.id, message.timestamp, message.name,
//                     message.text, message.profilePicUrl, message.imageUrl);
//             }
//         });
//     });
// }
