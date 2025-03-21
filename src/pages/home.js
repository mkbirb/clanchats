import React from "react";
import SendMessage from "../components/SendMessage";
import ReadMessage from "../components/ReadMessage";
import ChatList from "../components/ChatList";

const Home = () => {
    return (
        <>
            <ChatList />
            <ReadMessage />
            <SendMessage/>
            <h1>Welcome to ClansChat!</h1>
        </>
    )
}

export default Home;