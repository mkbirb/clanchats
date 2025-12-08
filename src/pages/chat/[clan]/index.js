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
import MusicStatusDisplay from "../../../components/MusicStatusDisplay";

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

    // Members of the room
    const [participants, setParticipants] = useState([]);

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

    const targetUserID = participants
    // If the Person is an Object than get the ID Property, otherwise if it is already an ID, just use it
    .map(p => (typeof p === 'object' && 'id' in p ? p.id : p))
    // Exclude the Current User
    .find(uid => uid !== user.id) || null;

    return (
        <> 
            {
                // Display once already fetched the Clan Data
                clanData ? (
                    <>
                        <div className="flex flex-2 w-full">
                            <div className="w-[25%]">
                                <ChatList clanData={clanData} currentRoomID={roomID} onSelectDirectRoom={handleSelectDirectRoom} onSelectGroupChat={handleGroupChatClick} />
                            </div>
                            <div className="w-full">
                                {
                                    // Display the Message Chat, when a User has been selected
                                    roomID ? (
                                        <>
                                            <div className="flex flex-row w-full">
                                                <div className="w-[70%]">
                                                    <ReadMessage clanID={clanData.id} roomType={roomType} participants={participants} setParticipants={setParticipants} targetUserID={targetUserID}/>
                                                    <SendMessage clanID={clanData.id} roomType={roomType} onReplySent={refreshReplyList}/>
                                                </div>
                                                <div className="w-[30%] bg-gray-950 text-white">
                                                    <SearchMessages clanID={clanData.id} roomType={roomType} />
                                                    <p className="font-bold text-center text-3xl !mb-2">🎶 Music Status </p>
                                                    <MusicStatusDisplay userID={targetUserID} />
                                                    <ReplyList clanID={clanData.id} roomType={roomType} refreshTrigger={refreshTrigger} refreshReplyList={refreshReplyList}/>
                                                </div>
                                            </div>
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