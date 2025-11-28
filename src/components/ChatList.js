import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { checkRoom, createRoom, retrieveRoom, getUserByID, createRetrieveGroupRoom, loadChatList, getCachedUserByID, listenToChatList } from "./firebaseConfig";
import UserPanel from "./UserPanel";
import DashboardButton from "./DashboardButton";
import ClanHomeIcon from '../images/clanHomeIcon.png';
import Image from "next/image";
import { getUpdatedTimeSince } from "../utils/getUpdatedTimeSince";

const ChatList = ({clanData, onSelectDirectRoom, onSelectGroupChat}) => {
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
                        <div key={room.roomId} onClick={() => onSelectGroupChat(clanData.id)}>
                            <div>
                                <p className="font-bold"> Group Chat </p>
                                <p>{room.latestMessage?.text || ""}</p>
                                <p>{getUpdatedTimeSince(room.latestMessage?.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                {
                    chatList.map((room) => {
                            const user = memberInfo[room.otherUserID];

                            return (
                                <div key={room.roomId} onClick={() => onSelectDirectRoom(room.otherUserID)} className="flex flex-row cursor-pointer">
                                    <img src={user?.profilePicture} alt={`${user?.name} profilePicture`} />
                                    <div>
                                        <p className="font-bold">{user?.name}</p>
                                        <p>{room.latestMessage?.text ? room.latestMessage.text : ""}</p>
                                        <p>{getUpdatedTimeSince(room.latestMessage?.createdAt)}</p>
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