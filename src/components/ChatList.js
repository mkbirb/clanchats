import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { checkRoom, createRoom, retrieveRoom, getUserByID, createRetrieveGroupRoom } from "./firebaseConfig";


const ChatList = ({clanData, onSelectDirectRoom, onSelectGroupChat}) => {
    const { userID} = useCurrentUser(); 
    const [memberInfo, setMemberInfo] = useState([]);

    useEffect(() => {
        const fetchMemberNames = async () => {
            if (!clanData?.members) return;

            // Filter out the current user
            const otherIDs = clanData.members.filter(id => id !== userID);

            // Fetch all user documents in parallel
            const users = await Promise.all(
                otherIDs.map(async (id) => {
                    const user = await getUserByID(id);
                    return user ? { ...user, id } : null;
                })
            );

            // Remove any nulls if a User was not found
            setMemberInfo(users.filter(Boolean));
        };

        fetchMemberNames();
    }, [clanData, userID]);


    return (
        <> 
            <p> People: </p>
            <button onClick={() => onSelectGroupChat(clanData.id)}> Group Chat </button>
            {
              memberInfo.map((user) => (
                    <>

                        <button key={user.id} onClick={() => onSelectDirectRoom(user.id)}> {user.name} </button>
                    </>
                ))
            }
        </>
    )
}

export default ChatList;