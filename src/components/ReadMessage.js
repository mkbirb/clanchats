import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages} from "./firebaseConfig.js";
import { format } from "date-fns"; 
import { useCurrentUser } from "../context/CurrentUserContext"; 


const ReadMessage = () => {
    const [messages, setMessages] = useState([]);
    const { userID, roomID } = useCurrentUser(); 

    useEffect(() => {
        console.log("Room ID:", roomID);
        const unsubscribe = retrieveMessages(setMessages, roomID);

        // Cleanup Function
        return () => unsubscribe();
    }, [roomID]);

    return (
        <>
          <p>Messages {userID}</p>
          <p>Room ID {roomID}</p>
          {messages.map((message, index) => (
            <li key={index}>  
              <p>{message.createdAt ? message.createdAt.toDate().toLocaleString() : ""}</p>
              {message.text}
            </li>
          ))}
        </>
      );
    
}

export default ReadMessage;