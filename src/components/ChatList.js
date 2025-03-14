import React, { useState, useEffect, useContext } from "react";
import { CurrentUser } from '../App';


const ChatList = () => {
    const { userID, roomID, changeRoomID } = useContext(CurrentUser); 

    return (
        <>
            <button onClick={() => changeRoomID(1)}> Person 1</button>
            <button onClick={() => changeRoomID(2)}> Person 2 </button>
        </>
    )
}

export default ChatList;