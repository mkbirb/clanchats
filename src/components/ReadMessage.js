import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages, deleteMessage, editMessage} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { ReplyContext } from '../context/ReplyContext';
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import RepliedMessage from "./RepliedMessage";


const ReadMessage = () => {
    const [messages, setMessages] = useState([]);
    const [editText, setEditText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
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

    const handleEdit = (messageId) => {
      editMessage(messageId, editText);
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
              <button onClick={() =>  {
                setEditingMessageId(message.id); 
                setEditText(message.text)}}> Edit </button>
              <RepliedMessage replyTo={message.replyTo} />

              {editingMessageId === message.id ? (
                <>
                    <textarea value={editText} onChange={(e) => setEditText(e.target.value) }/>
                    <button onClick={() => {
                        handleEdit(message.id);
                        setEditingMessageId(null);
                        setEditText(null);
                      }}> Update </button>
                    <button onClick={() => {
                      setEditingMessageId(null); 
                      setEditText(null);}}> Cancel </button>
                </>
              ) : (<p>{message.text} </p>)}

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