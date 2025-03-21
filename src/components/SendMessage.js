import React, { useState, useContext } from "react";
import {createMessage} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const { userID, roomID, changeRoomID } = useCurrentUser();

    function handleSend()  {
        const seen = false;

        createMessage(message, userID, roomID, seen); 
        
        // Reset the Message
        setMessage("");
    }
    return (
        <>
            <textarea 
                placeholder="Send a Message" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}/>
            <button onClick={handleSend}> Send </button>
        </>
    );
}

export default SendMessage;