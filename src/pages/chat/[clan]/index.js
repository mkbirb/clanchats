import React, { useEffect, useState } from "react";
import SendMessage from "../../../components/SendMessage";
import ReadMessage from "../../../components/ReadMessage";
import ChatList from "../../../components/ChatList";
import { useCurrentUser } from "../../../context/CurrentUserContext"; 
import { useRouter } from 'next/router';
import { checkRoom, createRetrieveGroupRoom, createRoom, retrieveClan, retrieveRoom } from "../../../components/firebaseConfig";
import { navigateTo } from "../../../components/Routes";
import SearchMessages from "../../../components/SearchMessages";
import ReplyList from "../../../components/ReplyList";
import ClanHome from "../../../components/ClanHome";
import { UserPresenceTracking } from "../../../utils/userPresenceTracking";

const chat = () => {

    const { user, roomID, changeRoomID} = useCurrentUser(); 

    // Get the Clan Name
    const router = useRouter();

    const [clanID, setClanID] = useState(null);
    const [clanData, setClanData] = useState(null);

    // For the Reply List, so that the Reply List updates when user has replied to a Message from this List
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshReplyList = () => setRefreshTrigger(prev => prev + 1);

    // Keeps track on what type of Room, whether it is Direct or Group Chat
    const [roomType, setRoomType] = useState("");

    // Gets the Clan ID from the URL Parameter
    useEffect(() => {
        if (router.isReady) {
            const {clan} = router.query;
            if (clan) {
                setClanID(clan);
            }
        }
    }, [router.isReady, router.query]);

    // Get the Clan Data that would be displayed
    useEffect(() => {
        if (!clanID) return;

        const fetchClan = async() => {
            const data = await retrieveClan(clanID);

            if(data) {
                setClanData(data);
            }
            else {
                console.log("Clan cannot be fetched")
            }
        };

        fetchClan();

    }, [clanID])

    // Used for when the User selects the Direct User Room or the Group Chat Buttons
    const handleSelectDirectRoom = async (otherUserID) => {

        // Check if Room exists
        const roomExists = await checkRoom(user.id, otherUserID);

        console.log("Room Exists is ", roomExists);
        if(!roomExists) {
            // Create the Room
            await createRoom(user.id, otherUserID);
        }

        // Then retrieve the Room
        const roomData = await retrieveRoom(user.id, otherUserID);

        console.log("Room Data ", roomData);
        console.log("Room Data ID ", roomData.room.id);

        // Change the RoomID
        changeRoomID(roomData.room.id);

        setRoomType(roomData.roomType);
    }

    const handleGroupChatClick = async (clanID) => {
        const groupRoom = await createRetrieveGroupRoom(clanID);

        changeRoomID(groupRoom.id);
        setRoomType(groupRoom.roomType);
    };

    return (
        <> 
            {
                // Display once already fetched the Clan Data
                clanData ? (
                    <>
                        <div className="flex flex-2">
                            <div>
                                <button onClick={() => {navigateTo(router, "DASHBOARD"), changeRoomID(null) }}> To Dashboard </button>
                                <h1 className="font-mono text-3xl font-bold text-blue-600"> Clan: {clanData.name}!</h1>
                                <ChatList clanData={clanData} onSelectDirectRoom={handleSelectDirectRoom} onSelectGroupChat={handleGroupChatClick} />
                            </div>
                            <div>
                                {
                                    // Display the Message Chat, when a User has been selected
                                    roomID ? (
                                        <>
                                            <ReadMessage clanID={clanData.id} roomType={roomType} />
                                            <SendMessage clanID={clanData.id} roomType={roomType} onReplySent={refreshReplyList}/>
                                            <ReplyList clanID={clanData.id} roomType={roomType} refreshTrigger={refreshTrigger} refreshReplyList={refreshReplyList}/>
                                            <SearchMessages clanID={clanData.id} roomType={roomType} />
                                        </>

                                    ) : (
                                        <>
                                            <ClanHome clanData={clanData}/>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </>
                ): (
                <p> Loading... </p>
            )}
            {user && user.username ? (
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome {user.username}!!</h1>
            ) : (
            <p className="text-gray-500">Loading user...</p>
            )}
        </>
    )
}

export default chat;