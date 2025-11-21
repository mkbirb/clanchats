import React, { useState, useContext, useEffect, useRef} from "react";
import {createMessage, incrementRoomExperience, startTyping, stopTyping} from "./firebaseConfig.js";
import { CurrentUserProvider, useCurrentUser } from "../context/CurrentUserContext"; 
import { uploadImageToImgBB } from '../utils/imageUpload';
import { ReplyContext } from "../context/ReplyContext.js";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import EmojiPicker from './EmojiPicker.js';
import { jumpToMessage } from "../utils/jumpToMessage.js";
import { useTypingUsers } from "../customHooks/useTypingUsers.js";

const SendMessage = ({clanID, roomType = "direct", onReplySent}) => {
    const [message, setMessage] = useState("");
    const { userID, roomID, user} = useCurrentUser();
    const [image, setImage] = useState(null);
    const {replyTo, setReplyTo} = useContext(ReplyContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    
    const typingTimeout = useRef(null);

    const expGivenPerMessage = 5;

    const [originalMessage, setOriginalMessage] = useFetchOriginalMessage(clanID, roomType, replyTo);

    // When the User sends a message, page would scroll down to the bottom of Chat Messages
    const bottomRef = useRef(null);     

    const addEmoji = (emoji) => {
        if (emoji.native) {
            // Add if its just a Native Emoji
            setMessage(prev => prev + emoji.native);
        }
        else if (emoji.id) {
            // For the handling of Custom Emojis
            setMessage(prev => prev + `:${emoji.id}:`);
        }
        else {
            console.log("Unexpected Emoji format for adding Emojis");
        }
        
    }

    const handleSend = async(e) =>  {
        e.preventDefault();

        const seen = [];

        let imageUrl = null; 

        if (image) {
          // Upload the image and get the URL
          imageUrl = await uploadImageToImgBB(image); 
        }

        // Allows the Reply List to be updated
        if (onReplySent && originalMessage) {
            onReplySent();
        }

        console.log("Vitamin D", clanID);

        await createMessage(message, userID, roomID, roomType, clanID, seen, imageUrl, replyTo); 

        // Scroll to bottom of Messages
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Increase the Experience for the Room, only if Direct Room

        console.log("let me explain ", roomType)
        if (roomType === "direct") {
            await incrementRoomExperience(roomID, expGivenPerMessage);
        }
        
        // Reset the Message
        setMessage("");
        setImage(null);
        setReplyTo(null);
        setOriginalMessage(null);
    }

    const handleMessageInputChange = (e) => {
        setMessage(e.target.value);

        if (!isTyping) {
            setIsTyping(true);
            startTyping(roomID, user);
        }

        // If there is already a Timeout from previous typing, then reset timer
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        // After a period of Inactivity from Typing, stop Typing Indicator
        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
            stopTyping(roomID, userID);
        }, 3000)
    }

    // Retrieve the Users that are typing
    const typingUsers = useTypingUsers(roomID, userID)

    return (
        <>
            <form onSubmit={handleSend}>
                {originalMessage && (
                    <div>
                        <p> Replying To</p>
                        <p> {originalMessage.text} </p>
                    </div>
                )}
                <EmojiPicker onEmojiSelect={addEmoji} />
                <textarea 
                    placeholder="Send a Message" 
                    value={message}
                    onChange={(e) => handleMessageInputChange(e)}
                    onKeyDown={(e) => {
                        // Also ensures that Shift + Enter still creates a New Line
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                        }
                    }}/>
                <input 
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                />
                <input
                    type="submit"
                    className="!bg-blue-500 !text-white !font-semibold !py-2 px-4 !rounded-lg shadow-md hover:!bg-blue-600 !focus:outline-none focus:ring-2 !focus:ring-blue-500 !focus:ring-opacity-50 active:!bg-blue-700"
                >
                </input>
            </form>
            {typingUsers.length > 0 && ( 
                <div>
                    {typingUsers.map(user => user.displayName).join(", ")} typing...
                </div>
            )}
            <div ref={bottomRef} />
        </>
    );
}

export default SendMessage;