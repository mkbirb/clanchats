import React, { useEffect, useState } from "react";
import {createClan, getSpecificUsersIDs, searchUsers} from "../components/firebaseConfig.js";
import Modal from 'react-modal';
import useImagePreview from "../customHooks/useImagePreview";
import { uploadImageToImgBB } from '../utils/imageUpload';
import {navigateTo} from '../components/Routes';
import {useRouter} from "next/router";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DisplayMyClans from "../components/DisplayMyClans.js";
import Logout from "../components/Logout.js";
import DashboardProfile from "../components/DashboardProfile.js";
import UserSelector from "../components/UserSelector.js";
import { UserPresenceTracking } from "../utils/userPresenceTracking.js";
import buildClanIcon from '../images/clanBuildHammer.png';
import Image from 'next/image';

const dashboard = () => {
    const [displayCreateClanModal, setDisplayCreateClanModal] = useState(false);
    const { imageFile, previewURL, handleImageChange } = useImagePreview();

    // Create the States for the Clan Creation
    const [clanName, setClanName] = useState('');
    const [clanLogo, setClanLogo] = useState('');
    const [clanDescription, setClanDescription] = useState('');

    // Create States that would help with the adding of the people to a Clan
    const [addPeopleInput, setAddPeopleInput] = useState('');
    const [usernameSuggestions, setUsernameSuggestions] = useState([]);
    const [clanMemberList, setClanMemberList] = useState([]);
    const [showUsernameDropdown, setShowUsernameDropdown] = useState(false);

    // For the Navigation to success page
    const router = useRouter();

    const { user, userID, loading } = useCurrentUser(); 

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

    const handleSubmit = async(e) => {
        // Prevent refresh so we keep all the States still
        e.preventDefault();

        let imageUrl = null; 

        if (clanLogo) {
            // Upload the image and get the URL
            imageUrl = await uploadImageToImgBB(clanLogo); 
        }

        try {
            
            // Translate the Usernames choosen into User IDs that would then be stored in the Database
            let listOfClanMembers = await getSpecificUsersIDs(clanMemberList);
            // Add the User creating the Clan as well into the List
            listOfClanMembers = [userID, ...listOfClanMembers];

            const clanCreatedID = await createClan(clanName, imageUrl, listOfClanMembers, clanDescription);

            if (clanCreatedID) {
                alert("Clan created successfully!");

                // Navigate to Chat Page when Clan Creation sucessful
                navigateTo(router, "CHAT", clanCreatedID)
            }
            else {
                console.log("Clan creation failed");
            } 
        }
        catch(error) {
            alert("Failed Clan Creation: ", error.message);
            console.log("Failed Clan Creation ", error);
        }
    }

    useEffect(() => {
        fetchUsernames();
    }, [addPeopleInput])

    if (loading) return <p>Loading...</p>;


    return (
        <>
            <UserPresenceTracking />
            <DashboardProfile />
            <DisplayMyClans />
            <div className="place-content-center">
                <div className="place-self-center bg-amber-500 rounded-2xl h-50 w-1/2 cursor-pointer grid grid-cols-2" onClick={() => {setDisplayCreateClanModal(true)}}>
                    <div className="place-self-center">
                        <Image src={buildClanIcon} alt="Build Clan Icon"/>
                    </div>
                    <div className="place-self-center text-center">
                        <p className="text-white font-bold text-3xl !mb-2"> Create Clan </p>
                        <p className="text-white text-xl"> Form your next Clan Group Chat </p>
                        <p className="text-white font-bold text-6xl"> + </p>
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={displayCreateClanModal}
                onRequestClose={() => {setDisplayCreateClanModal(false)}}
            >
                <p> Create your Clan!! </p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="clanName"> What is your Clan Name?</label>
                    <input id="clanName" type="text" placeholder="Insert Clan Name" onChange={(e) => setClanName(e.target.value) }/>
                    <label htmlFor="clanPicture"> What is your Clan Logo? </label>
                    <input id="clanPicture" type="file" onChange={(e) => {
                        handleImageChange(e);
                        setClanLogo(e.target.files[0]);
                    }} accept="image/*" />
                    { // Previews the Image that has been uploaded by the User
                        previewURL && (
                            <>
                                <img src={previewURL} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                            </>
                        )
                    }
                    <label htmlFor="addMembers"> Who is in your Clan? </label>
                    <UserSelector onAdd={handleAddClanMember} selectedUsers={clanMemberList} />
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
                    <input id="clanDescription" type="text" placeholder="Give description of your Clan" onChange={(e) => setClanDescription(e.target.value)}></input>
                    <button> Build!! </button>
                </form>
                <button onClick={() => {setDisplayCreateClanModal(false)}}> Cancel </button>
            </Modal>
            <Logout />
        </>
    )
}

export default dashboard;