// Displays the Users Status after Presence + Status calculation

import { useEffect, useState } from "react";
import { subscribeToUserPresenceAndStatus } from "./firebaseConfig";
import { getDisplayStatus } from "../utils/getDisplayStatus";
import { useUserRTDBPresence } from "../customHooks/useUserRTDBPresence";

const PresenceDisplay = ({userID}) => {
    const [presence, setPresence] = useState("offline");
    const [status, setStatus] = useState("online");

    const [isBackOnline, setIsBackOnline] = useState(false);

    useEffect(() => {
        if (!userID) return;

        const unsub = subscribeToUserPresenceAndStatus(userID, ({presence, status}) => {
            if (!isBackOnline) {
                setPresence(presence);
                setStatus(status);
            }
        })

        const handleComeOnline = () => {
            setIsBackOnline(true);
            // Optimistic Approach, where when the User comes back online, set presence to Online immediately
            // Then let the database to catch up to update the presence
            setPresence("online");
            setTimeout(() => setIsBackOnline(false), 2000);
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                handleComeOnline();
            }
        };

        window.addEventListener("online", handleComeOnline);
        document.addEventListener("visibilitychange", handleVisibilityChange);


        return () => {
            unsub();
            window.removeEventListener("online", handleComeOnline);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };

    }, [userID, isBackOnline])

    const presenceFromRTDB = useUserRTDBPresence(userID);

    const displayStatus = getDisplayStatus({
        status,
        presence: presenceFromRTDB
    });

    // console.log("RTDB presence:", presenceFromRTDB);

    return (
        <>
            <span> 
                Status of user: 
                {displayStatus === "online" && (
                    <p> 🟢 Online </p>
                )}
                {displayStatus === "idle" && (
                    <p>🟡 Idle</p>
                )}
                {displayStatus === "away" && (
                    <p> 🟠 Away from Home</p>
                )}
                {displayStatus === "slow" && (
                    <p> 🔵 Slow Replies </p>
                )}
                {displayStatus === "doNotDisturb" && (
                    <p> 🔴 Do Not Disturb </p>
                )}
                {displayStatus === "offline" && (
                    <p> 🔘 Offline </p>
                )}

            </span>
        </>
    )
}

export default PresenceDisplay;