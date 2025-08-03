import React, { useEffect, useState } from "react";
import SendMessage from "../../../components/SendMessage";
import ReadMessage from "../../../components/ReadMessage";
import ChatList from "../../../components/ChatList";
import { useCurrentUser } from "../../../context/CurrentUserContext"; 
import { useRouter } from 'next/router';
import { retrieveClan } from "../../../components/firebaseConfig";
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

    return (
        <> 
            {
                // Display once already fetched the Clan Data
                clanData ? (
                    <>
                        <button onClick={() => {navigateTo(router, "DASHBOARD"), changeRoomID(null) }}> To Dashboard </button>
                        <h1 className="font-mono text-3xl font-bold text-blue-600"> Clan: {clanData.name}!</h1>
                        <ChatList clanData={clanData} />
                        {
                            // Display the Message Chat, when a User has been selected
                            roomID ? (
                                <>
                                    <ReadMessage />
                                    <SendMessage onReplySent={refreshReplyList}/>
                                    <ReplyList refreshTrigger={refreshTrigger} refreshReplyList={refreshReplyList}/>
                                    <SearchMessages />
                                </>

                            ) : (
                                <>
                                    <ClanHome clanData={clanData}/>
                                </>
                            )
                        }
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