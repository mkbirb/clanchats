// Snapshot that listens to the User typing

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useTypingUsers = (roomID, currentUserID) => {
    const [typingUsers, setTypingUsers] = useState([]);

    useEffect(() => {
        if (!roomID) {
            return;
        }

        const typingRef = collection(db, "rooms", roomID, "typing");

        const unsubscribe = onSnapshot(typingRef, snapshot => {
            const now = Date.now();
            // Display list of typing users who arent Current User
            // And have typed in last 5 seconds
            const users = snapshot.docs.map(doc => doc.data()).filter(doc => doc.userID !== currentUserID).filter(doc => {
                const ts = doc.timestamp?.toMillis?.() || 0;
                return now - ts < 5000;
            })

            setTypingUsers(users);
        })

        return () => unsubscribe();
    }, [roomID, currentUserID])

    return typingUsers
}