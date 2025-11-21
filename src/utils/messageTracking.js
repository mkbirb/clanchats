import { onSnapshot, writeBatch, arrayUnion, doc, query, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Keeps track of the Messages being Delivered to the Recipient
export function messageDeliveryTracking(clanID, roomID, roomType, currentUserID) {

    let messageRef;

    if (roomType === "direct") {
        messageRef = query(collection(db, `rooms/${roomID}/messages`));
    }
    else if (roomType === "group") {
        messageRef = query(collection(db, `clan/${clanID}/groupChats/${roomID}/messages`));
    }

    const unsubscribe = onSnapshot(messageRef, (snapshot) => {
        const batch = writeBatch(db);
        
        snapshot.docs.forEach((doc) => {
            const message = doc.data();

            if (!message.deliveredTo?.includes(currentUserID)) {
                // Queues an update if the current user has not been marked as someone who has its messages delivered too yet
                batch.update(doc.ref, {
                    deliveredTo: arrayUnion(currentUserID),
                })
            }
        });

        // Sends the update queue in one go
        batch.commit();
    })

    return unsubscribe;
}

export async function messageSeenTracking(messages, currentUserID, clanId, roomID, roomType) {
    const unseenMessages = messages.filter(
        msg => !msg.seenBy?.[currentUserID]
    )

    // Do all or nothing update
    const batch = writeBatch(db);

    for (const msg of unseenMessages) {
        if (!msg?.id) continue;
        
        if (!msg) {
            console.error(`Message at index ${index} is undefined or null`, msg);
            return;
        }

        if (!msg.id) {
            console.error(` Missing message ID for message at index ${index}:`, msg);
            return;
        }

        if (!roomID) {
            console.error(`roomID is undefined — cannot construct Firestore path.`);
            return;
        }

        if (!currentUserID) {
            console.error(`currentUserID is undefined — cannot track seenBy.`);
            return;
        }
        
        let messageRef;

        if (roomType === "direct") {
            messageRef = doc(db, "rooms", roomID, "messages", msg.id);
        }
        else if (roomType === "group") {
            messageRef = doc(db, "clan", clanId, "groupChats", roomID, "messages", msg.id);
        }
        // Check if the Message is still there to SeenTrack
        try {
            const snap = await getDoc(messageRef);

            if (!snap.exists()) {
                console.log("Message deleted, skipping seen update:", msg.id);
                continue;
            }
            
            batch.update(messageRef, {
                [`seenBy.${currentUserID}`]: serverTimestamp(),
            });
        }
        catch (error) {
            console.error("Error processing message for Message Seen Tracking:", msg.id, error);
        }

    }

    try {
        await batch.commit();
    }
    catch (error) {
        console.error("Batch commit failed:", error);
    }
}