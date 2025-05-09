import React, { useEffect, useState } from "react";
import SendMessage from "../../components/SendMessage";
import ReadMessage from "../../components/ReadMessage";
import ChatList from "../../components/ChatList";
import { useCurrentUser } from "../../context/CurrentUserContext"; 
import { useRouter } from 'next/router';
import { retrieveClan } from "../../components/firebaseConfig";
import { navigateTo } from "../../components/Routes";

const chat = () => {

    const { user } = useCurrentUser(); 

    // Get the Clan Name
    const router = useRouter();

    const [clanID, setClanID] = useState(null);
    const [clanData, setClanData] = useState(null);

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
                        <button onClick={() =>navigateTo(router, "DASHBOARD") }> To Dashboard </button>
                        <h1 className="font-mono text-3xl font-bold text-blue-600"> Clan: {clanData.name}!</h1>
                        <ChatList clanData={clanData} />
                        <ReadMessage />
                        <SendMessage/>
                    </>
                ): (
                <p> Loading... </p>
            )}
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome {user.username}!</h1>
        </>
    )
}

export default chat;