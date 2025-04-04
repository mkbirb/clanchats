import React from "react";
import SendMessage from "../components/SendMessage";
import ReadMessage from "../components/ReadMessage";
import ChatList from "../components/ChatList";

const Chat = () => {
    return (
        <>
            <ChatList />
            <ReadMessage />
            <SendMessage/>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome dddtos!</h1>
        </>
    )
}

export default Chat;