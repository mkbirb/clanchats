import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { checkRoom, createRoom, retrieveRoom, getUserByID } from "./firebaseConfig";


const ChatList = ({clanData}) => {
    const { userID, roomID, changeRoomID } = useCurrentUser(); 
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

    const createOrRetrieveRoom = async(otherUserID) => {
        // Check if Room exists
        const roomExists = await checkRoom(userID, otherUserID);

        console.log("Room Exists is ", roomExists);
        if(!roomExists) {
            // Create the Room
            await createRoom(userID, otherUserID);
        }

        // Then retrieve the Room
        const roomData = await retrieveRoom(userID, otherUserID);

        console.log("Room Data ", roomData);
        console.log("Room Data ID ", roomData.room.id);

        // Change the RoomID
        changeRoomID(roomData.room.id);
    }
     

    return (
        <> 
            <p> People: </p>
            {
              memberInfo.map((user) => (
                    <>

                        <button key={user.id} onClick={() => createOrRetrieveRoom(user.id)}> {user.name} </button>
                    </>
                ))
            }
        </>
    )
}

export default ChatList;