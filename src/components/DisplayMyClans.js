import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { getClansBasedOnUser } from "./firebaseConfig";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";


const DisplayMyClans = () => {
    const { userID } = useCurrentUser(); 
    const [myClanList, setMyClanList] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchClans = async () => {
            const userClans = await getClansBasedOnUser(userID);
            setMyClanList(userClans);
        }

        // If there is a User ID, then we would Fetch the Clans
        if (userID) {
            fetchClans();
        }
    }, [userID])

    const handleGoToClan = (clanID) => {
        // Go to the Clan Chat Page
        navigateTo(router, "CHAT", clanID)
    }

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