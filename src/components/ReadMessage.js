import React, { useState, useEffect } from "react";
import {retrieveMessages} from "./firebaseConfig.js";
import { format } from "date-fns"; 


const ReadMessage = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = retrieveMessages(setMessages);

        // Cleanup Function
        return () => unsubscribe();
    }, []);

    return (
        <>
            <p> Messages </p>
            {messages.map((message) => (
                <>
                    <p> {message.createdAt ? message.createdAt.toDate().toLocaleString(): ""} </p>
                    <li key={message.id}> {message.text} </li>
                </>
            ))}
        </>
    )
    
}

export default ReadMessage;