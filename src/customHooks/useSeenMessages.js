// Custom Hook to help with Messages being seen by the User
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { messageSeenTracking } from '../utils/messageTracking';
import debounce from 'lodash/debounce';

const useSeenMessages = (messages, currentUserID, clanId, roomID, roomType) => {
    const observer = useRef(null);
    // Reuse the same function that has been created through UseCallback to optimise Performance
    // Debounce helps for optimisation as well
    const handleSeen = useCallback(debounce(async(seenMessagesIDs) => {
        await messageSeenTracking(seenMessagesIDs, currentUserID, clanId, roomID, roomType)
    }, 300), [currentUserID, roomID])

    // Enhance Performance by caching
    const messageMap = useMemo(() => {
        const map = new Map();
        messages.forEach(m => map.set(m.id, m));
        return map;
    }, [messages]);

    useEffect(() => {
        const seenMessageIDs = new Set();

        // Disconnect any previous observers to prevent Memory Leaks
        if (observer.current) {
            observer.current.disconnect();
        }

        // Create a new Observer that tracks when Elements are scrolled into the View
        observer.current = new IntersectionObserver((entries) => {
            const newSeen = [];

            // Check for each of the Elements and whether they were visible in the screen to be marked as seen
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const msgId = entry.target.getAttribute('data-id');
                    
                    // Add new messages that has not been marked as Seen
                    if (msgId && !seenMessageIDs.has(msgId)) {
                        seenMessageIDs.add(msgId);
                            const fullMsg = messageMap.get(msgId);
                            if (fullMsg) {
                                newSeen.push(fullMsg);
                            } 
                            else {
                                console.warn("Couldn't find full message for ID:", msgId);
                            }
                    }
                }
            })

            if (newSeen.length > 0) {
                handleSeen(newSeen);
            }
        }, {threshold: 0.5})

        messages.forEach((msg) => {
            // Skip Messages that have already been seen to reduce quota
            if (msg.seenBy?.[currentUserID]) return;

            const el = document.querySelector(`[id="message-${msg.id}"]`);
            if (el) observer.current.observe(el);
        });

        // Cleanup
        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [messages, handleSeen])
}

export default useSeenMessages;