import React, { useEffect, useState } from "react";
import {searchUsers} from "../components/firebaseConfig.js";
import Modal from 'react-modal';
import useImagePreview from "../customHooks/useImagePreview";

const dashboard = () => {
    const [displayCreateClanModal, setDisplayCreateClanModal] = useState(false);
    const { imageFile, previewURL, handleImageChange } = useImagePreview();

    // Create States that would help with the adding of the people to a Clan
    const [addPeopleInput, setAddPeopleInput] = useState('');
    const [usernameSuggestions, setUsernameSuggestions] = useState([]);
    const [clanMemberList, setClanMemberList] = useState([]);
    const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);

    // Get the searching of Usernames when User begins to type to add individuals to the clan
    const fetchUsernames = async () => {
        const searchList = await searchUsers(addPeopleInput);
        setUsernameSuggestions(searchList);
        setShowUsernameDropdown(searchList.length > 0);
    }

    const handleAddClanMember = (user) => {
        // No longer display Username Suggestions List, once the Username has been selected
        setAddPeopleInput('');
        setShowUsernameDropdown(false);
        setClanMemberList(prevList => [...prevList, user]);
    }

    const handleRemoveClanMember = (userToRemove) => {
        // Removes the Member from the Clan List
        setClanMemberList(prevList =>
            prevList.filter(user => user !== userToRemove)
        );
    }

    useEffect(() => {
        fetchUsernames();
    }, [addPeopleInput])

    return (
        <>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome!!</h1>
            <button onClick={() => {setDisplayCreateClanModal(true)}}> Create Clan </button>

            <Modal 
                isOpen={displayCreateClanModal}
                onRequestClose={() => {setDisplayCreateClanModal(false)}}
            >
                <p> Create your Clan!! </p>
                <form>
                    <label htmlFor="clanName"> What is your Clan Name?</label>
                    <input id="clanName" type="text" placeholder="Insert Clan Name"/>
                    <label htmlFor="clanPicture"> What is your Clan Logo? </label>
                    <input id="clanPicture" type="file" onChange={handleImageChange} accept="image/*" />
                    { // Previews the Image that has been uploaded by the User
                        previewURL && (
                            <>
                                <p> You say </p>
                                <img src={previewURL} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                            </>
                        )
                    }
                    <label htmlFor="addMembers"> Who is in your Clan? </label>
                    <input id="addMembers" type="text" placeholder="Add Usernames" value={addPeopleInput} onChange={(e) => setAddPeopleInput(e.target.value)}/>
                    { //Displaying of Username Suggestion List
                        (usernameSuggestions.length > 0) && showUsernameDropdown && (
                            <>
                                <ul>
                                {usernameSuggestions.map((user, index) => {
                                    // Dont suggest a Username that is already in the Clan Member List
                                    if (!clanMemberList.includes(user)) {
                                        return (
                                            <li key={index} onClick={() => handleAddClanMember(user)}>
                                                {user}
                                            </li>
                                        );
                                    }
                                    return null; 
                                })}
                                </ul>
                            </>
                        )
                    }
                    { // Displaying of the Clan Members that is currently being added
                        (clanMemberList.length > 0) && (
                            <>
                                <p> Clan Members </p>
                                <ul>
                                    {clanMemberList.map((user, index) => (
                                        <> 
                                            <li key={index}>
                                                {user}
                                            </li>
                                            <button type="button" onClick={() => handleRemoveClanMember(user)}> Remove</button>
                                        </>
                                    ))}
                                </ul>
                            </>
                        )
                    }
                    <label htmlFor="clanDescription"> Define your clan </label>
                    <input id="clanDescription" type="text" placeholder="Give description of your Clan"></input>
                    <button> Build!! </button>
                </form>
                <button onClick={() => {setDisplayCreateClanModal(false)}}> Cancel </button>
            </Modal>
        </>
    )
}

export default dashboard;