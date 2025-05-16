import React, { useState, useEffect} from "react"; 
import {getUserReactionsFromMessage} from "./firebaseConfig.js";

// For the displaying of the Reactions for each Message
const ReactionsDisplay = ({ messageId, reactions, roomID, userID, refreshTrigger }) => {

    const [userReactions, setUserReactions] = useState([]);
    
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
        {Object.entries(reactions).map(([emoji, count]) => (
            <span
            key={emoji}
            style={{
                background: userReactions.includes(emoji) ? "yellow" : "transparent",
                padding: "0.2rem",
                marginRight: "0.3rem",
                borderRadius: "5px"
            }}
            >
            {count === 0 ? "" : `${emoji} ${count}`}
            </span>
        ))}
        </div>
  );
}

export default ReactionsDisplay;