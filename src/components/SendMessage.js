import React, { useState, useContext, useEffect } from "react";
import {createMessage} from "./firebaseConfig.js";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { uploadImageToImgBB } from '../utils/imageUpload';
import { ReplyContext } from "../context/ReplyContext.js";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";

const SendMessage = () => {
    const [message, setMessage] = useState("");
    const { userID, roomID, changeRoomID } = useCurrentUser();
    const [image, setImage] = useState(null);
    const {replyTo, setReplyTo} = useContext(ReplyContext);

    const [originalMessage, setOriginalMessage] = useFetchOriginalMessage(replyTo);

    const handleSend = async(e) =>  {
        e.preventDefault();

        const seen = false;

        let imageUrl = null; 

        if (image) {
          // Upload the image and get the URL
          imageUrl = await uploadImageToImgBB(image); 
        }

        await createMessage(message, userID, roomID, seen, imageUrl, replyTo); 
        
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
                <textarea 
                    placeholder="Send a Message" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}/>
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

        </>
    );
}

export default SendMessage;