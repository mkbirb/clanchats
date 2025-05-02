import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages, deleteMessage, editMessage, addReaction, listenToReactions} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { ReplyContext } from '../context/ReplyContext';
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import RepliedMessage from "./RepliedMessage";
import ReactionPicker from "./ReactionPicker.js";


const ReadMessage = () => {
    const [messages, setMessages] = useState([]);
    const [editText, setEditText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const { userID, roomID } = useCurrentUser(); 

    const {replyTo, setReplyTo} = useContext(ReplyContext);

    const originalMessage = useFetchOriginalMessage(replyTo);

    // For the Reactions
    const [reactions, setReactions] = useState({});
    // Displays the Reaction Pickers for the specific Message
    const [showReactionPicker, setShowReactionPicker] = useState(null);

    useEffect(() => {
        console.log("Room ID:", roomID);
        const unsubscribe = retrieveMessages(setMessages, roomID);

        // Cleanup Function
        return () => unsubscribe();
    }, [roomID]);

    // Updates the Messages Reactions based on Database
    useEffect(() => {
      const unsubscribe = listenToReactions(messages, (messageId, reactionData) => {
        setReactions(prev => ({
          ...prev,
          [messageId]: reactionData
        }));
      });
    
      return () => unsubscribe();
    }, [messages]);

    const handleDelete = (messageId) => {
      deleteMessage(messageId);
    }

    const handleEdit = (messageId) => {
      editMessage(messageId, editText);
    }

    const handleReaction = async (messageId, emoji) => {
        try {
          await addReaction(messageId, userID, emoji);
        }
        catch(error) {
          console.log("Reaction had Failed ", error);
        }
    }

    // Formatting of the Date and the Time
    const formatDateTime = (date) => {
      const formattedDate = date.toLocaleDateString('en-GB', {
        // Day of the Week
        weekday: 'long',
        // The Full Year
        year: 'numeric',
        // The Full Month Name
        month: 'long',  
        // Day Date Number
        day: 'numeric'   
      });
      
      // 24 Hour clock like 00:39
      const formattedTime = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',  
        minute: '2-digit' 
      });

      return `${formattedDate} ${formattedTime}`
    }

    return (
        <>
          <p>Messages {userID}</p>
          <p>Room ID {roomID}</p>
          {messages.map((message, index) => (
            <li key={index}>  
              <p>{message.createdAt ? message.createdAt.toDate().toLocaleString() : ""}</p>
              <p> {message.editedAt ? `Edited At: ${formatDateTime(new Date(message.editedAt))}` : ""} </p>
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

              <button onClick={
                // Open the Reaction Picker if null, where if Reaction Picker already set to Message ID and is therefore showing
                // When React button is clicked again, we set it to Null to hide the Reaction Picker
                () => setShowReactionPicker(showReactionPicker === message.id ? null: message.id)
              }>
                👍
              </button>
              {
                showReactionPicker === message.id && (
                  // Update the State and then close the Reaction Picker
                  <ReactionPicker onSelect={(emoji) => {
                    handleReaction(message.id, emoji);
                    setShowReactionPicker(null);
                    }}
                  />
                )
              }
              <div style={{ marginTop: '0.5rem' }}>
                { // Display the Reaction Emoji with its corresponding Reaction Count
                  Object.entries(reactions[message.id] || {}).map(([emoji, count]) => (
                  <span key={emoji}>
                    {emoji} {count}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </>
      );
    
}

export default ReadMessage;