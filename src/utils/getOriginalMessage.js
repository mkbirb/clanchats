import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getOriginalMesssage = async(replyToId, roomID) => {
    if(!replyToId) {
        console.log("No Reply ID given for getting the Original Message");
        return null;
    }

    const msgRef = doc(db, "rooms", roomID, "messages", replyToId);

    // Fetch the Document from Firebase
    const msgSnap = await getDoc(msgRef);

    if (msgSnap.exists()) {
        return {id: msgSnap.id, ...msgSnap.data()}
    }
    else {
        console.log("No Reply ID found");

        return null;
    }
}