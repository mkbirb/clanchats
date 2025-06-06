// Custom Hook that gets the Username of the Messages past

import { useEffect, useState } from "react";
import { getUserByID } from "../components/firebaseConfig";

const useFetchMessageOwner = (messages) => {
    const [messageUsername, setMessageUsername] = useState({});

    useEffect(() => {
        const fetchUserInformation = async () => {
        // Get the Unique IDs within the Messages
        const ids = [...new Set(messages.map(msg => msg.userID))];
        const newUsernames = { ...messageUsername };

        // Promise All, does runs asynchronously
        await Promise.all(ids.map(async(id) => {
            if(!messageUsername[id]) {
            // If the Username does not exist in the list gathered, get it
            const userInformation = await getUserByID(id);
            
            if(userInformation.username) {
                // Add the Messages Username List
                newUsernames[id] = userInformation.username;
            }
            else {
                newUsernames[id] = "Unknown";
                console.log("Cannot find the Username for the Message");
            }
            }
        }))

        setMessageUsername(newUsernames);
        }

        if(messages.length > 0) {
        fetchUserInformation();
        }
    }, [messages])

    return messageUsername;
}

export default useFetchMessageOwner;