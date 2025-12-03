import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { checkRoom, createRoom, retrieveRoom, getUserByID, createRetrieveGroupRoom, loadChatList, getCachedUserByID, listenToChatList } from "./firebaseConfig";
import UserPanel from "./UserPanel";
import DashboardButton from "./DashboardButton";
import ClanHomeIcon from '../images/clanHomeIcon.png';
import Image from "next/image";
import { getUpdatedTimeSince } from "../utils/getUpdatedTimeSince";
import PresenceDisplay from "./PresenceDisplay";

const ChatList = ({clanData, currentRoomID, onSelectDirectRoom, onSelectGroupChat}) => {
    const { userID, user, changeRoomID} = useCurrentUser(); 
    const [memberInfo, setMemberInfo] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [groupChatList, setGroupChatList] = useState([]);


    useEffect(() => {
        if (!user) return;

        const fetchChats = async () => {
            const {chatList, groupChatList, userMap} = await loadChatList(user.id, clanData.id, clanData);
            setChatList(chatList);

            setMemberInfo(userMap);

            setGroupChatList(groupChatList);
        }

        fetchChats();
    }, [user]);

    useEffect(() => {
        const unsubscribe = listenToChatList(user.id, clanData.id, clanData, setChatList, setGroupChatList, setMemberInfo);
        return () => unsubscribe();
    }, [user.id, clanData]);
    

    return (
        <> 
            <div>
                <UserPanel currentUser={user} />
                <div className="flex flex-2 bg-black justify-center !p-2">
                    <img src={clanData.logo} className="rounded-full aspect-square object-cover w-[10%] h-[10%]" />
                    <p className="font-bold text-white !p-3"> {clanData.name} </p>
                </div>
                <div className="flex flex-row !p-3 justify-center bg-[#ffcc4d] gap-3">
                    <DashboardButton />
                    <button 
                        onClick={() => {changeRoomID(null)}} 
                        className="flex flex-col !bg-black !text-white cursor-pointer items-center !font-bold !border-none !rounded-2xl !p-2"> 
                        <Image src={ClanHomeIcon} alt="Clan Home Icon" width={35} height={35} /> Clan Home </button>
                </div>
                {
                    groupChatList.map((room) => (
                        <div 
                            key={room.roomId} 
                            onClick={() => onSelectGroupChat(clanData.id)} 
                            className={`flex flex-row cursor-pointer items-center w-full !p-2
                                        ${currentRoomID === room.roomId ? "bg-green-200" : "bg-transparent"}`}>
                                <div className="flex-shrink-0 relative w-fit items-center justify-center">
                                    <img 
                                        src={clanData.logo} 
                                        alt="Clan Logo"
                                        className="!rounded-full !object-cover !w-18 !h-17"  />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0 !ml-3">
                                    <div className="relative flex justify-center w-full">
                                        <p className="font-bold text-center w-full"> Group Chat </p>
                                        <p className="absolute top-0 right-0 text-sm text-gray-400">{getUpdatedTimeSince(room.latestMessage?.createdAt)}</p>
                                    </div>
                                        <p className="text-center truncate w-full">
                                            {(room.latestMessage?.imageURL && room.latestMessage?.text)
                                                ? `🏞️ Image | ${room.latestMessage?.text}`
                                                : room.latestMessage?.imageURL
                                                ? "🏞️ Image"
                                                : room.latestMessage?.text ?? ""}
                                        </p>
                                </div>
                        </div>
                    ))}
                    <hr className="!h-2 !w-1/2 !mx-auto !bg-orange-400 !border-0 !rounded !mt-3 !mb-3"/>
                {
                    chatList.map((room) => {
                            const user = memberInfo[room.otherUserID];

                            return (
                                <div 
                                    key={room.roomId} 
                                    onClick={() => onSelectDirectRoom(room.otherUserID)} 
                                    className={`flex flex-row cursor-pointer items-center w-full !p-2
                                        ${currentRoomID === room.roomId ? "bg-green-200" : "bg-transparent"}`}>
                                    <div className="flex-shrink-0 relative w-fit items-center justify-center">
                                        <img 
                                            src={user?.profilePicture} 
                                            alt={`${user?.name} profilePicture`} 
                                            className="!rounded-full !object-cover !w-18 !h-17" />
                                        <div className="absolute bottom-0 -right-2">
                                            <PresenceDisplay userID={user?.id} shortened={true} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0 !ml-3">
                                        <div className="relative flex justify-center w-full">
                                            <p className="font-bold text-center w-full">{user?.name}</p>
                                            <p className="absolute top-0 right-0 text-sm text-gray-400">{getUpdatedTimeSince(room.latestMessage?.createdAt)}</p>
                                        </div>
                                        <p className="text-center truncate w-full">
                                            {(room.latestMessage?.imageURL && room.latestMessage?.text)
                                                ? `🏞️ Image | ${room.latestMessage?.text}`
                                                : room.latestMessage?.imageURL
                                                ? "🏞️ Image"
                                                : room.latestMessage?.text ?? ""}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
        </>
    )
}

export default ChatList;