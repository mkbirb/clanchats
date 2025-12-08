import React, { useState, useContext, useEffect, useRef} from "react";
import {createMessage, incrementRoomExperience, startTyping, stopTyping} from "./firebaseConfig.js";
import { CurrentUserProvider, useCurrentUser } from "../context/CurrentUserContext"; 
import { uploadImageToImgBB } from '../utils/imageUpload';
import { ReplyContext } from "../context/ReplyContext.js";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";
import EmojiPicker from './EmojiPicker.js';
import { jumpToMessage } from "../utils/jumpToMessage.js";
import { useTypingUsers } from "../customHooks/useTypingUsers.js";
import uploadImageIcon from '../images/uploadImageIcon.png';
import messageSendIcon from '../images/messageSendIcon.png';
import Image from "next/image.js";

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
        setReplyTo(null);
        setOriginalMessage(null);

        removeImage();
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
    const typingUsers = useTypingUsers(roomID, userID);

    const removeImage = () => {
        setImage(null);

        // Also reset the file input
        const fileInput = document.getElementById("imageUpload");
        if (fileInput) {
            fileInput.value = "";
        }
    }

    return (
        <>
            <div className="flex flex-col !w-[50%] fixed bottom-0 bg-white">

                {/* Preview the Images Uploaded */}
                {image && (
                    <div className="relative w-48 h-38">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full object-cover rounded-lg shadow-md !h-35"
                        />
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-1 !text-3xl !font-bold right-1 cursor-pointer bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center !hover:bg-red-600"
                        >
                            ×
                        </button>
                    </div>
                )}
                {originalMessage && (
                    <div className="relative !bg-amber-300 !p-1 !rounded-2xl">
                        <p className="font-semibold">
                            Replying To
                        </p>
                        {originalMessage.text && originalMessage.imageURL ? (
                            <p className="italic"> 🏞️ Image | {originalMessage.text} </p>
                            ) : originalMessage.text ? (
                            <p>{originalMessage.text}</p> 
                            ) : originalMessage.imageURL ? (
                            <p className="italic">🏞️ Image</p> 
                            ) : null}
                        <button
                            type="button"
                            onClick={() => {setOriginalMessage(null), setReplyTo(null)}}
                            className="text-black absolute top-1 right-1 !font-bold cursor-pointer !text-2xl px-2 py-1"
                        >
                            ×
                        </button>
                    </div>
                )}
                <form 
                    onSubmit={handleSend}
                    className="flex flex-row !gap-x-2">
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
                        }}
                        className="flex-grow !h-12 resize-none !rounded-lg !border-2 !text-lg !border-gray-300  focus:outline-none transition-all duration-200 shadow-md"/>
                    <input 
                        type="file"
                        id="imageUpload"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                    />
                    <label 
                        htmlFor="imageUpload"
                        className="
                            !w-10
                            cursor-pointer 
                            bg-gray-200 
                            !rounded-full 
                            !flex items-center 
                            justify-center 
                            transition-colors 
                            duration-200">
                            <Image
                                src={uploadImageIcon}
                                alt="Upload Image"
                                className="w-8 h-8"
                            />
                    </label>
                    <input
                        type="submit"
                        className="hidden !text-white !font-semibold !py-2 px-4 !rounded-lg shadow-md hover:!bg-blue-600 !focus:outline-none focus:ring-2 !focus:ring-blue-500 !focus:ring-opacity-50 active:!bg-blue-700"
                        id="sendMessage"
                    >
                    </input>
                    <label 
                        htmlFor="sendMessage"
                        className="
                            !w-10
                            cursor-pointer 
                          bg-black
                            !rounded-full 
                            !flex items-center 
                            justify-center 
                            transition-colors 
                            duration-200
                            ">
                        <Image 
                            src={messageSendIcon} 
                            alt="Send Message"
                            className="w-8 h-8"/>
                    </label>
                </form>
            </div>
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