import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages, deleteMessage} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { ReplyContext } from '../context/ReplyContext';
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import RepliedMessage from "./RepliedMessage";


const ReadMessage = () => {
    const [messages, setMessages] = useState([]);
    const { userID, roomID } = useCurrentUser(); 

    const {replyTo, setReplyTo} = useContext(ReplyContext);

    const originalMessage = useFetchOriginalMessage(replyTo);

    useEffect(() => {
        console.log("Room ID:", roomID);
        const unsubscribe = retrieveMessages(setMessages, roomID);

        // Cleanup Function
        return () => unsubscribe();
    }, [roomID]);

    const handleDelete = (messageId) => {
      deleteMessage(messageId);
    }

    return (
        <>
          <p>Messages {userID}</p>
          <p>Room ID {roomID}</p>
          {messages.map((message, index) => (
            <li key={index}>  
              <p>{message.createdAt ? message.createdAt.toDate().toLocaleString() : ""}</p>
              <button onClick={() => setReplyTo(message.id)}> Reply </button>
              <button onClick={() => handleDelete(message.id)}> Delete </button>
              <RepliedMessage replyTo={message.replyTo} />
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