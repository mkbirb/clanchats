import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function roomSeenTracking(roomID, currentUserID, lastMessageID) {
    if (!roomID || !currentUserID || !lastMessageID) return;

    const roomRef = doc(db, "rooms", roomID);

    try {
        await updateDoc(roomRef, {
            [`lastSeenBy.${currentUserID}`]: lastMessageID
        });
    } catch (error) {
        console.error("Failed to update lastSeenBy in room:", error);
    }
}
