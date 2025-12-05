import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {retrieveMessages, deleteMessage, editMessage, addReaction, listenToReactions, getUserByID, retrieveRoomBasedOnID, getCachedUserByID, createRetrieveGroupRoom, retrieveClan} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { ReplyContext } from '../context/ReplyContext';
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import RepliedMessage from "./RepliedMessage";
import ReactionPicker from "./ReactionPicker.js";
import ViewImage from "./ViewImage.js";
import ReactionsDisplay from "./ReactionsDisplay.js";
import DisplayRoomLevel from "./DisplayRoomLevel.js";
import useFetchMessageOwner from "../customHooks/useFetchMessageOwner.js";
import { useRouter } from "next/router.js";
import useCustomEmojis from "../customHooks/useCustomEmojis.js";
import { messageDeliveryTracking, messageSeenTracking } from "../utils/messageTracking.js";
import useSeenMessages from "../customHooks/useSeenMessages.js";
import SeenIcon from "./SeenIcon.js";
import PresenceDisplay from "./PresenceDisplay.js";
import YoutubeEmbed from "./YoutubeEmbed.js";
import RoomHeader from "./RoomHeader.js";


const ReadMessage = ({clanID, roomType = "direct"}) => {
    const [messages, setMessages] = useState([]);
    const [editText, setEditText] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const { userID, roomID } = useCurrentUser(); 

    const {replyTo, setReplyTo} = useContext(ReplyContext);

    const originalMessage = useFetchOriginalMessage(clanID, roomType, replyTo);

    // For the Reactions
    const [reactions, setReactions] = useState({});
    // Displays the Reaction Pickers for the specific Message
    const [showReactionPicker, setShowReactionPicker] = useState(null);

    // Used, so the Reactions are able to update to show that User has reacted with that emoji that would be passed 
    // To the Reactions Display Component
    const [refreshReactions, setRefreshReactions] = useState(false);

    // Retrieve the Clan from the Query
    const { clan } = useRouter().query;
    const { customEmojis } = useCustomEmojis(clan);

    // Members of the room
    const [participants, setParticipants] = useState([]);

    // To prevent Race Conditions, where the SeenIcon temp disappears for one of the participants, 
    // when a new unseen (From recipient perspective) message is sent
    const [lastStableSeenID, setLastStableSeenID] = useState(null);

    const [participantData, setParticipantData] = useState({});

    const messagesContainerRef = useRef(null);

    useEffect(() => {
        console.log("Room ID:", roomID);

        if (!roomID) {
            console.log("Invalid or missing roomID, cannot fetch messages.");
            return;  
        }

        const unsubscribe = retrieveMessages(setMessages, clanID, roomID, roomType);

        // Cleanup Function
        return () => unsubscribe();
    }, [roomID]);

    // Updates the Messages Reactions based on Database
    useEffect(() => {
      const unsubscribe = listenToReactions(clanID, roomID, roomType, (messageId, reactionData) => {
        setReactions(prev => ({
          ...prev,
          [messageId]: reactionData
        }));
      }, roomID);
    
      return () => unsubscribe();
    }, [roomID]);

    const messageUsername = useFetchMessageOwner(messages);

    const targetUserID = participants
    // If the Person is an Object than get the ID Property, otherwise if it is already an ID, just use it
    .map(p => (typeof p === 'object' && 'id' in p ? p.id : p))
    // Exclude the Current User
    .find(uid => uid !== userID) || null;


    const lastSeenMessage = [...messages]
      .reverse()
      .find(msg => {
        // Convert the Object to Array
        const seenArray = msg.seenBy ? Object.keys(msg.seenBy) : [];
        return seenArray.includes(targetUserID);
      });

    const lastSeenMessageID = lastSeenMessage?.id;

    // For the indicator that Message has been delivered to recipient
    useEffect(() => {
      const unsubscribe = messageDeliveryTracking(clanID, roomID, roomType, userID);
      return () => unsubscribe()
    }, [roomID, userID]);

    // // For the Indicator that a Message has been seen by recipient
    useSeenMessages(messages, userID, clanID, roomID, roomType);

    useEffect(() => {
      const fetchRoom = async () => {
        try {
          if (!roomID) return; 

          const data = await retrieveRoomBasedOnID(roomID);

          // Extract person1 and person2 into participants
          const { person1, person2} = data || {};

          const participantList = [person1, person2].filter(Boolean);
          setParticipants(participantList);
        } catch (error) {
          console.error("Failed to fetch room data:", error);
        }
      };

      const fetchClanMembers = async () => {
        const clanData = await retrieveClan(clan);

        setParticipants(clanData.members);
      }

      if (roomType == "direct") {
        fetchRoom();
      }
      else if (roomType == "group") {
        fetchClanMembers();
      }
    }, [roomID]);

    useEffect(() => {
      const fetchParticipantInfo = async () => {
        const result = {};

        for (const participant of participants) {
          const uid = typeof participant === 'string' ? participant : participant.id;
          const user = await getCachedUserByID(uid);
          if (user) {
            result[uid] = user;
          }
        }

        setParticipantData(result); 
      };

      if (participants.length > 0) {
        fetchParticipantInfo();
      }
    }, [participants]);


    useEffect(() => {
        if (!lastSeenMessageID) return;

        if (!lastStableSeenID) {
          setLastStableSeenID(lastSeenMessageID);
        } 
        else {
          const currentIndex = messages.findIndex(m => m.id === lastSeenMessageID);
          const previousIndex = messages.findIndex(m => m.id === lastStableSeenID);

          if (currentIndex > previousIndex) {
            setLastStableSeenID(lastSeenMessageID);
          }
        }
    }, [lastSeenMessageID, messages]);

    // Autoscroll to the bottom when Messages are being read or when new message sent
    useEffect(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
      }
    }, [messages])

    const handleDelete = (messageId) => {
      deleteMessage(messageId, clanID, roomID, roomType);
    }

    const handleEdit = (messageId) => {
      editMessage(messageId, editText, clanID, roomID, roomType);
    }

    const handleReaction = async (messageId, emoji) => {
        try {
          await addReaction(messageId, userID, emoji, clanID, roomID, roomType);
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

    // Get a Map of the last seen Message IDs for the Group Chat
    const userLastSeenMap = useMemo(() => {
      const map = {};

      for (const msg of messages) {
        if (!msg.seenBy) continue;

        // Go through the Users who has seen the message
        for (const uid of Object.keys(msg.seenBy)) {
          // Skip the current user
          if (uid === userID) continue;

          map[uid] = msg.id;
        }
      }

      return map;
    }, [messages, userID])

const renderMessageWithCustomEmojis = (text) => {
  return text
    .split(/(:\w+:)/g) 
    .flatMap((part, i) => {
      const match = part.match(/^:(\w+):$/);
      if (match) {
        const emojiId = match[1];
        const emoji = customEmojis.find((e) => e.id === emojiId);

        if (emoji) {
          return (
            <img
              key={`emoji-${i}`}
              src={emoji.skins?.[0]?.src || emoji.imageUrl}
              alt={emoji.name}
              title={emoji.name}
              className="w-5 h-5 !inline-block !align-middle !mx-1"
            />
          );
        }
      }

      // Split normal text on \n and insert <br /> manually
      return part.split('\n').flatMap((line, j, arr) =>
        j < arr.length - 1
          ? [<span key={`${i}-${j}`}>{line}</span>, <br key={`br-${i}-${j}`} />]
          : [<span key={`${i}-${j}`}>{line}</span>]
      );
    });
};

    return (
        <>
          <RoomHeader participantData={participantData} targetUserID={targetUserID} roomType={roomType} />
          {
            messages.length === 0 ? (
              <>
                <p> Looks like this is a new Chat, send the first message!</p>
              </>
            ): (
                <div className="!h-screen flex flex-col">
                  <div className="flex-1 !overflow-y-auto px-3" ref={messagesContainerRef}>
                    {messages.map((message) => (
                    <div key={message.id}>  
                      <p>{message.createdAt ? message.createdAt.toDate().toLocaleString() : ""}</p>
                      <p> {messageUsername[message.userID]} </p>
                      <p> {message.editedAt ? `Edited At: ${formatDateTime(new Date(message.editedAt))}` : ""} </p>
                      <button onClick={() => setReplyTo(message.id)}> Reply </button>
                      <button onClick={() => handleDelete(message.id)}> Delete </button>
                      <button onClick={() =>  {
                        setEditingMessageId(message.id); 
                        setEditText(message.text)}}> Edit </button>
                      <RepliedMessage clanID={clanID} roomType={roomType} replyTo={message.replyTo} />

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
                        <div id={`message-${message.id}`} data-id={`${message.id}`} className="whitespace-pre-wrap break-words leading-tight">
                          {renderMessageWithCustomEmojis(message.text)} 
                          <YoutubeEmbed textMessage={message.text} />
                          {/* {console.log("Rendering message ID:", message.id)}
                          {console.log("Last seen message ID:", lastSeenMessageID)} */}
                          {roomType === "direct" && (
                            <SeenIcon 
                              message={message} 
                              currentUserID={userID} 
                              lastSeenMessageID={lastStableSeenID} 
                              showSeenIcon={message.id === lastStableSeenID}
                              userMap={participantData}/>
                          )}

                          {roomType === "group" && (
                            <SeenIcon
                              message={message}
                              currentUserID={userID}
                              groupLastSeen={userLastSeenMap}   
                              userMap={participantData}
                            />
                          )}
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
                        clanID={clanID}
                        roomID={roomID}
                        roomType={roomType}
                        userID={userID}
                        refreshTrigger={refreshReactions}
                      />
                    </div>
                  ))}
                  </div>
                </div>
            )
          }
        </>
      );
    
}

export default ReadMessage;