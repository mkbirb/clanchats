import React, { useState, useContext, useEffect, useRef} from "react";
import {createMessage, incrementRoomExperience} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { uploadImageToImgBB } from '../utils/imageUpload';
import { ReplyContext } from "../context/ReplyContext.js";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import EmojiPicker from './EmojiPicker.js';
import { jumpToMessage } from "../utils/jumpToMessage.js";

const SendMessage = ({onReplySent}) => {
    const [message, setMessage] = useState("");
    const { userID, roomID, changeRoomID } = useCurrentUser();
    const [image, setImage] = useState(null);
    const {replyTo, setReplyTo} = useContext(ReplyContext);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const expGivenPerMessage = 5;

    const [originalMessage, setOriginalMessage] = useFetchOriginalMessage(replyTo);

    // When the User sends a message, page would scroll down to the bottom of Chat Messages
    const bottomRef = useRef(null);     


    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji.native);
    }

    const handleSend = async(e) =>  {
        e.preventDefault();

        const seen = false;

        let imageUrl = null; 

        if (image) {
          // Upload the image and get the URL
          imageUrl = await uploadImageToImgBB(image); 
        }

        // Allows the Reply List to be updated
        if (onReplySent && originalMessage) {
            onReplySent();
        }

        await createMessage(message, userID, roomID, seen, imageUrl, replyTo); 

        // Scroll to bottom of Messages
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Increase the Experience for the Room
        await incrementRoomExperience(roomID, expGivenPerMessage);
        
        // Reset the Message
        setMessage("");
        setImage(null);
        setReplyTo(null);
        setOriginalMessage(null);
    }
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
                    onChange={(e) => setMessage(e.target.value)}
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
            <div ref={bottomRef} />
        </>
    );
}

export default SendMessage;