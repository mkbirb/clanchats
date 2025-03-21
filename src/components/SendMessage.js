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
            <button onClick={handleSend} className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700"> 
                Send
            </button>
        </>
    );
}

export default SendMessage;