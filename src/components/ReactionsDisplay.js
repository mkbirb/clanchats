import React, { useState, useEffect} from "react"; 
import {addReaction, getUserReactionsFromMessage, removeReaction} from "./firebaseConfig.js";

// For the displaying of the Reactions for each Message
const ReactionsDisplay = ({ messageId, reactions, reactionsOrder = [], roomID, userID, refreshTrigger}) => {

    const [userReactions, setUserReactions] = useState([]);

    // Provides a fallback for when the ReactionsOrder is missing
    const safeReactionsOrder = Array.isArray(reactionsOrder) ? reactionsOrder : [];

    const handleReactionRemoval = async (emoji) => {
        try {
            await removeReaction(messageId, userID, emoji, roomID);

            // Immediately Refresh the User Reactions, so correctly displays which is no longer form user
            setUserReactions((prev) => prev.filter(e => e !== emoji));
        }
        catch (error) {
            console.log("Reaction cannot be removed ", error);
        }
    }

    const handleReactionAdd = async (emoji) => {
        try {
            await addReaction(messageId, userID, emoji, roomID);
            
            // Immediately Refresh the User Reactions, so correctly displays which is now the users
            setUserReactions((prev) => [...prev, emoji]);
        }
        catch (error) {
            console.log("Reaction cannot be added", error);
        }
    }
    
    useEffect(() => {
        const fetchUserReacted = async () => {
            try {
                const userReactionsFromDatabase = await getUserReactionsFromMessage(messageId, roomID, userID);
                setUserReactions(userReactionsFromDatabase);
                console.log("UserReacted From Database ", userReactionsFromDatabase);
            } 
            catch (error) {
                console.log("Cannot log the User Reactions ", error);
            }
        };

        if (messageId && userID && roomID) fetchUserReacted();
    }, [messageId, roomID, userID, refreshTrigger]);

    return (
        <div style={{ marginTop: "0.5rem" }}>
        {safeReactionsOrder.map((emoji) => {
            const count = reactions[emoji] || 0;
            if (count === 0) return null;

            return (
                <span
                    key={emoji}
                    style={{
                        background: userReactions.includes(emoji) ? "yellow" : "transparent",
                        padding: "0.2rem",
                        marginRight: "0.3rem",
                        borderRadius: "5px"
                    }}
                    onClick={() => {
                        userReactions.includes(emoji)
                            ? handleReactionRemoval(emoji)
                            : handleReactionAdd(emoji);
                    }}
                    className="cursor-pointer hover:opacity-70"
                >
                    {emoji} {count}
                </span>
            );
        })}
        </div>
  );
}

export default ReactionsDisplay;