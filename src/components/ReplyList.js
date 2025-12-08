// Displays the List of Replies that the User has not responded to yet in the specific chat
import React, { useState, useEffect} from "react"; 
import { addRemovedReplyListMessageID, getUnRepliedMessages } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";
import { jumpToMessage } from "../utils/jumpToMessage";
import useFetchMessageOwner from "../customHooks/useFetchMessageOwner";
import caughtUpWithRepliesIcon from '../images/caughtUpWithReplies.png';
import Image from "next/image";

const ReplyList = ({clanID, roomType, refreshTrigger, refreshReplyList}) => {

    const { userID, roomID } = useCurrentUser(); 
    const [replyList, setReplyList] = useState([]);

    // Get the Usernames of the Messages
    const messageUsername = useFetchMessageOwner(replyList);

    useEffect (() => {
        const unrepliedMessages = async () => {

            try {
                const messageList = await getUnRepliedMessages(clanID, roomID, roomType, userID);

                setReplyList(messageList);
            }
            catch (error) {
                console.log("Could not gather Reply List: ", error);
            }
        }

        unrepliedMessages();
    },  [roomID, userID, refreshTrigger])

    const removeFromReplyList = async (messageID) => {
        try {
            await addRemovedReplyListMessageID(clanID, roomID, roomType, userID, messageID);

            // Then refresh the Reply List
            refreshReplyList();
        }
        catch (error) {
            console.log("Removed Message from Reply List unsuccessful ", error);
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <p className="relative group w-fit cursor-pointer text-center font-bold text-3xl self-center"> 📩Reply List
                    <span className="absolute left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block 
                    rounded bg-gray-800 px-2 py-1 !text-sm text-white shadow-lg z-50 w-80 text-center">
                        Tracks the Messages in the Room that you have not responded to yet. 
                        <br></br>
                        <b>Messages would be added to this list if they are 3 Words or more!</b>
                    </span>
                </p>
                {replyList.length === 0 ? (
                    <>
                        <Image 
                            src={caughtUpWithRepliesIcon} 
                            alt="CaughtUpWithRepliesIcon"
                            className="h-1/2 w-1/2 self-center"
                            />
                        <p className="text-center italic"> You are all caught up with Replies!</p>
                    </>
                ) : (
                <ul>
                    {replyList.map((message, index) => {
                    return (
                        <li key={index}> 
                            <div onClick={() => jumpToMessage(message.id)}>
                                <p>{messageUsername[message.userID] || "Loading..."}</p>
                                <p>{message.text}</p>
                            </div>
                            <button onClick={() => removeFromReplyList(message.id)}> Remove </button>
                        </li>
                    );
                    })}
                </ul>
                )}
            </div>
        </> 
    )
}

export default ReplyList;