import { db } from '../firebase';
import {collection, addDoc, serverTimestamp } from "firebase/firestore";

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


