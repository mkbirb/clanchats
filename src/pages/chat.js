import React from "react";
import SendMessage from "../components/SendMessage";
import ReadMessage from "../components/ReadMessage";
import ChatList from "../components/ChatList";
import { useCurrentUser } from "../context/CurrentUserContext"; 

const chat = () => {

    const { user } = useCurrentUser(); 

    return (
        <>
            <ChatList />
            <ReadMessage />
            <SendMessage/>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome {user.username}!</h1>
        </>
    )
}

export default chat;