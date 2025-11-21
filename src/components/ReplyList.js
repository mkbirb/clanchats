// Displays the List of Replies that the User has not responded to yet in the specific chat
import React, { useState, useEffect} from "react"; 
import { addRemovedReplyListMessageID, getUnRepliedMessages } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";
import { jumpToMessage } from "../utils/jumpToMessage";
import useFetchMessageOwner from "../customHooks/useFetchMessageOwner";

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
            <p>Your Reply List (Only for 3 Words and Up):</p>
            {replyList.length === 0 ? (
            <p> You are all caught up with Replies!</p>
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
        </> 
    )
}

export default ReplyList;