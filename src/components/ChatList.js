import React, { useState, useEffect, useContext } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"; 


const ChatList = () => {
    const { userID, roomID, changeRoomID } = useCurrentUser(); 

    return (
        <>
            <button onClick={() => changeRoomID(1)}> Person 1</button>
            <button onClick={() => changeRoomID(2)}> Person 2 </button>
        </>
    )
}

export default ChatList;