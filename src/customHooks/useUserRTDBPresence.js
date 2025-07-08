// Custom Hook that listens to the Users Presence from the Realtime Database in Real Time

import { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { onValue, ref } from "firebase/database";

export function useUserRTDBPresence(userID) {
    const [presence, setPresence] = useState("offline");

    useEffect(() => {
        if (!userID) return;

        const statusRef = ref(rtdb, `/status/${userID}`);
        console.log("📥 Subscribing to:", `/status/${userID}`);


        // OnValue sets up a real time listener
        const unsub = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            console.log("Presence snapshot from RTDB:", data);
            if (data?.state) {
                setPresence(data.state);
            }
        })

        return () => unsub();
    }, [userID]);

    return presence;

}