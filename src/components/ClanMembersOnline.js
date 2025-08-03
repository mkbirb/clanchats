// Displays the Number of Users online for a particular clan

import { useEffect, useState } from "react"
import { listenToOnlineCountForClan } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const ClanMembersOnline = ({ clanData }) => {
    const [membersOnline, setMembersOnline] = useState(null);

    useEffect(() => {
        let unsubscribeStatus = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && clanData?.members?.length) {
                unsubscribeStatus = listenToOnlineCountForClan(clanData.members, (count) => {
                    setMembersOnline(count);
                    console.log("Members online:", count);
                });
            }
        });

        // Return cleanup function
        return () => {
            if (unsubscribeStatus) unsubscribeStatus();
                unsubscribeAuth(); 
        };
    }, [clanData?.members]);


    return (
        <>
            {console.log("Clan Membeyhrnjem ", membersOnline)}
            <p className="text-green-400 font-bold text-l"> Members Online: {membersOnline} </p>
        </>
    )
}

export default ClanMembersOnline;