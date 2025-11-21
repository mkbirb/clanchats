import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { getSpecificUsersIDs, getUserByID, searchMessages } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";

const SearchMessages = ({clanID, roomType}) => {
    const [searchModalViewed, setSearchModalViewed] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [fromUser, setFromUser] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [messagesFound, setMessagesFound] = useState([]);
    const [messageUsername, setSearchUsername] = useState("");

    const { userID, roomID } = useCurrentUser();

    useEffect(() => {
        const retrieveMessagesSearched = async () => {
                
            try {
                const results = await searchMessages(clanID, roomID, roomType, {username: fromUser|| null, startDate: startDate || null, endDate: endDate || null, searchInput: searchInput || null});
                setMessagesFound(results);

                // Get the unique User IDs
                const userIDs = [...new Set(results.map(msg => msg.userID))];

                // Fetch usernames for each userID
                const usersMap = {};
                for (const id of userIDs) {
                    const user = await getUserByID(id); 
                    usersMap[id] = user.username;
                }

                setSearchUsername(usersMap);
            }
            catch (error) {
                console.log("Unable to retrieve Messages being searched ", error);
            }
        }

        retrieveMessagesSearched();
    }, [searchInput, fromUser, startDate, endDate])

    return (
        <>
            <button onClick={() => setSearchModalViewed(true)}> Search </button>
            <Modal
                isOpen={searchModalViewed}
                onRequestClose={() => setSearchModalViewed(false)}>
                    <p> Search Messages </p>
                    <p> Note: Due to Limitations, you can only search Exact Phrasings! I.e if you searching "cat" and there are messages like "Theres a cat over there", it would say "No Messages Found", but if you search for "Theres a cat over there", you will find your message!</p>
                    <input type="text" placeholder="Search Messages..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <input type="text" placeholder="From User..." value={fromUser} onChange={(e) => setFromUser(e.target.value)} />
                    <label for="startDate"> Start Date: </label>
                    <input id="startDate" type="date" placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label for="endDate"> End Date: </label>
                    <input id="endDate" type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                    {/* Displaying of Message Results */}
                    {messagesFound.length === 0 ? (
                        <p> No Messages can be found </p>
                    ): (
                        <ul>
                            {
                                messagesFound.map((msg) => (
                                    <li> 
                                        <p>{messageUsername[msg.userID] || "Unknown User"}</p>
                                        <p> {msg.createdAt?.toDate().toLocaleString()} </p>
                                        <p> {msg.text} </p> 
                                    </li>
                                ))
                            }
                        </ul>
                    )}
            </Modal>
        </>
    )
}

export default SearchMessages;