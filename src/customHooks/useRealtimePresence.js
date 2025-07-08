// Custom Hook that ensures that the User Online Presence is actually updated in real time
// Particulary when user was offline then becomes online

import { rtdb } from "../firebase";
import { ref, onDisconnect, onValue, set, serverTimestamp } from "firebase/database";
import { useEffect } from "react";


export function useRealtimePresence(userID) {
    console.log("Writing presence to:", `/status/${userID}`);
    useEffect(() => {
        if (!userID) return;

        const statusRef = ref(rtdb, `/status/${userID}`);

        // Informs whether the client is currently connected to the Realtime Database
        const connectedRef = ref(rtdb, ".info/connected");

        const unsub = onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) return;

            // On disconnect, set offline
            onDisconnect(statusRef).set({
                state: "offline",
                lastChanged: serverTimestamp(),
            });

            // When connected, set online
            set(statusRef, {
                state: "online",
                lastChanged: serverTimestamp(),
            });
        });

        return () => {
            unsub();
        };
    }, [userID])
}