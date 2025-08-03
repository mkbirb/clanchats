import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { getClansBasedOnUser } from "./firebaseConfig";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";
import ClanMembersOnline from "./ClanMembersOnline";


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
            <div className="place-items-center">
                <div className="bg-black w-130 h-15 place-content-center !mt-10 !mb-5">
                    <p className="text-3xl text-white font-bold text-center"> My Clans </p>
                </div>
            </div>
                {   
                    myClanList.length === 0 ? (
                        <p> No Clans can be found</p>
                    ): (
                        <div className="grid grid-cols-5 !pl-8 sm:!pl-2 md:!pl-6 lg:!pl-10">
                            {myClanList.map((clan) => (
                                <>
                                    <div className="bg-gray-100 rounded-3xl w-2xs h-65 place-items-center !mb-10 text-center cursor-pointer" onClick={() => handleGoToClan(clan.id)}>
                                        <img src={clan.logo} alt="clanLogo" className="h-35 w-35 rounded-full aspect-square object-cover !mt-5 !mb-5"/>
                                        <button className="!font-bold !text-xl !mb-1" key={clan.id}> {clan.name} </button>
                                        <ClanMembersOnline clanData={clan} />
                                    </div>
                                </>
                            ))}
                            <div></div>
                        </div>
                    )
                }
        </>
    )
}

export default DisplayMyClans;