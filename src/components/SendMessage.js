import React, { useState } from "react";
import {createMessage} from "./firebaseConfig.js";

const SendMessage = () => {
    const [message, setMessage] = useState("");

    function handleSend()  {
        const userId = 1;
        const roomId = 1;
        const seen = false;

        createMessage(message, userId, roomId, seen); 
        
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