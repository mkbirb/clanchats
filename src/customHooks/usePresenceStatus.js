// Helps switches a user to idle

import { useEffect, useRef } from "react";
import { updateUserPresence, updateUserPresenceWithBeacon } from "../components/firebaseConfig";

// Idle Timeout is 2 Minutes
const IDLE_TIMEOUT = 2 * 60 * 100;

export function usePresenceStatus(userID) {
    const timeoutRef = useRef(null);
    const currentPresence = useRef("online");

    useEffect(() => {
        const setUserPresence = async (presence) => {
            if (presence != currentPresence.current) {
                currentPresence.current = presence;
                await updateUserPresence(presence, userID);
            }
        }


        // Define the Presences
        const goIdle = () => setUserPresence("idle");

        const goOnline = () => {
            // Cancel the Pending Idle Timeout
           if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
           }

            setUserPresence("online");

            // Set new timer for idle switch
            timeoutRef.current = setTimeout(goIdle, IDLE_TIMEOUT);
        }

        const goOffline = () => setUserPresence("offline");

        // If any activity is detected than mark user as online
        const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"];

        activityEvents.forEach((event) =>
            window.addEventListener(event, goOnline)
        );



        // Handles tab switching, where if the tab for the app is visible than mark online
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                goOnline();
            } 
            else {
                goIdle();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        window.addEventListener("offline", goOffline);
        window.addEventListener("online", goOnline);
        // User is offline when the tab/window is closed
        const handleBeforeUnload = () => {
            updateUserPresenceWithBeacon("offline", userID);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        goOnline();

        return (() => {
            // Cleanup
            activityEvents.forEach((event) => {
                window.removeEventListener(event, goOnline)
            });

            window.removeEventListener("offline", goOffline);
            window.removeEventListener("online", goOnline);
            window.removeEventListener("beforeunload", handleBeforeUnload);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        })

    }, [userID])
}