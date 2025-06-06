import React, { useState, useEffect, useContext } from "react";
import {retrieveMessages, deleteMessage, editMessage, addReaction, listenToReactions, getUserByID} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { ReplyContext } from '../context/ReplyContext';
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import RepliedMessage from "./RepliedMessage";
import ReactionPicker from "./ReactionPicker.js";
import ViewImage from "./ViewImage.js";
import ReactionsDisplay from "./ReactionsDisplay.js";
import DisplayRoomLevel from "./DisplayRoomLevel.js";
import useFetchMessageOwner from "../customHooks/useFetchMessageOwner.js";


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

    // Used, so the Reactions are able to update to show that User has reacted with that emoji that would be passed 
    // To the Reactions Display Component
    const [refreshReactions, setRefreshReactions] = useState(false);

    useEffect(() => {
        console.log("Room ID:", roomID);

        if (!roomID) {
            console.log("Invalid or missing roomID, cannot fetch messages.");
            return;  
        }
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
      }, roomID);
    
      return () => unsubscribe();
    }, [messages]);

    const messageUsername = useFetchMessageOwner(messages);

    const handleDelete = (messageId) => {
      deleteMessage(messageId, roomID);
    }

    const handleEdit = (messageId) => {
      editMessage(messageId, editText, roomID);
    }

    const handleReaction = async (messageId, emoji) => {
        try {
          await addReaction(messageId, userID, emoji, roomID);
          setRefreshReactions(prev => !prev);
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
          <DisplayRoomLevel />
          {
            messages.length === 0 ? (
              <>
                <p> Looks like this a new Chat, send the first message!</p>
              </>
            ): (
                messages.map((message, index) => (
                <li key={index}>  
                  <p>{message.createdAt ? message.createdAt.toDate().toLocaleString() : ""}</p>
                  <p> {messageUsername[message.userID]} </p>
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
                  ) : (
                    <div id={`message-${message.id}`}>
                      <p>{message.text} </p>
                    </div>
                    )}

                  {message.imageURL && (
                    <ViewImage src={message.imageURL} />
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
                  <ReactionsDisplay
                    key={message.id}
                    messageId={message.id}
                    reactions={reactions[message.id] || {}}
                    reactionsOrder={message.reactionsOrder || []}
                    roomID={roomID}
                    userID={userID}
                    refreshTrigger={refreshReactions}
                  />
                </li>
              ))
            )
          }
        </>
      );
    
}

export default ReadMessage;