import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { getClansBasedOnUser } from "./firebaseConfig";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";


const DisplayMyClans = () => {
    const { userID, loading } = useCurrentUser(); 
    const [myClanList, setMyClanList] = useState([]);
    const [clansLoading, setClansLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        console.log("userID:", userID, "loading:", loading);
    }, [userID, loading]);


    useEffect(() => {
        const fetchClans = async () => {
            if (!userID) return;
            setClansLoading(true);
            const userClans = await getClansBasedOnUser(userID);
            setMyClanList(userClans);
            setClansLoading(false);
        };

        if (!loading && userID) {
            fetchClans();
        }
    }, [userID]);

    const handleGoToClan = (clanID) => {
        // Go to the Clan Chat Page
        navigateTo(router, "CHAT", clanID)
    }

    if (loading || clansLoading) return <p>Loading clans...</p>;

    return(
        <>
            <p> My Clans </p>
                {   
                    myClanList.length === 0 ? (
                        <p> No Clans can be found</p>
                    ): (
                        myClanList.map((clan) => (
                            <>
                                <button key={clan.id} onClick={() => handleGoToClan(clan.id)}> {clan.name} </button>
                                <br></br>
                            </>
                        ))
                    )
                }
        </>
    )
}

export default DisplayMyClans;