import { db } from '../firebase';
import {collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";


export const createMessage = async (text, userId, roomId, seen) => {
    if (text.length == 0) {
        // Prevents Empty Messages
        return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            // Define the Document Model
            text: text,
            userId: userId,
            roomId: roomId,
            createdAt: serverTimestamp(),
            seen: seen,
        });
        console.log("Sent Message");
    }
    catch(error) {
        alert("Error creating the Message: " + error);
        console.log("Error creating the Message for: ", text, userId, roomId, createdAt, seen);
    }
};

export const retrieveMessages = (setMessages) => {
    // Refer to the correct collection
    const messagesRef = collection(db, "messages");

    // Request to the database
    const records = query(messagesRef, orderBy("createdAt", "asc"));

    // Onsnapshot returns an Unsubscribe function, despite subscribing to changes in the database itself.
    const unsubscribe = onSnapshot(records, (snapshot) => {
        const messageData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        // Update the State
        setMessages(messageData);
    }, (error) => {
        // Handle potential errors
        console.error("Error fetching messages:", error);
    });

    return unsubscribe;
    
}


