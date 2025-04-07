import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages} from "./firebaseConfig.js";
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
              {message.imageURL && (
                <div>
                  <img
                    src={message.imageURL}
                    alt="Uploaded content"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                </div>
              )}
            </li>
          ))}
        </>
      );
    
}

export default ReadMessage;