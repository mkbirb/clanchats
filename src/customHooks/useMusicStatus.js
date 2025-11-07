import { useEffect, useState } from "react";
import { listenToMusicStatus } from "../components/firebaseConfig";

// Fetches the Users Music Status
const useMusicStatus = (userID) => {
    const [musicStatus, setMusicStatus] = useState(null);

    useEffect(() => {
        if (!userID) return;
        const unsubscribe = listenToMusicStatus(userID, setMusicStatus);

        // Cleanup
        return () => unsubscribe();
    }, [userID])

    return musicStatus;
}

export default useMusicStatus