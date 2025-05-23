// Displays the Users Profile on their dashboard
// Where they can change Profile Picture or update Statuses

import { useEffect, useState } from "react";
import { getUserByID, updateOnlineStatus, updateProfilePicture, updateWordStatus } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";
import Modal from 'react-modal';
import { uploadImageToImgBB } from "../utils/imageUpload";
import useImagePreview from "../customHooks/useImagePreview";

const DashboardProfile = () => {
    const { userID } = useCurrentUser(); 
    const [profilePicture, setProfilePicture] = useState(null);
    const [wordStatus, setWordStatus] = useState(null);
    const [onlineStatus, setOnlineStatus] = useState(null);
    const [displayChangeWordStatus, setDisplayChangeWordStatus] = useState(false);
    const [displayChangeProfilePicture, setDisplayChangeProfilePicture] = useState(false);

    // Used for the Modals, such as the Change Word Status Display
    const [tempWordStatus, setTempWordStatus] = useState("");
    const [tempProfilePicture, setTempProfilePicture] = useState("");

    const { imageFile, previewURL, setPreviewManually, handleImageChange, resetPreview } = useImagePreview();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getUserByID(userID);

                setProfilePicture(userData.profilePicture);
                setWordStatus(userData.wordStatus);
                setOnlineStatus(userData.onlineStatus);
            }
            catch(error) {
                console.log("Cannot fetch User profile for Dashboard Profile");
            }
        }

        fetchUserProfile();
        
    }, [userID]);

    const handleOnlineStatus = (e) => {
        // Change Online Status State
        setOnlineStatus(e);

        // Then update Database
        updateOnlineStatus(userID, e);
    }

    const handleWordStatus = (e) => {
        e.preventDefault();

        // Change the Word Status State
        setWordStatus(tempWordStatus);

        // Then update the Database
        updateWordStatus(userID, tempWordStatus);

        // Then close the Display Modal
        setDisplayChangeWordStatus(false);
    }

    const handleProfilePicture = async (e) => {
        e.preventDefault();
        
        let imageUrl = null; 
        
        if (tempProfilePicture) {
            // Upload the image and get the URL
            imageUrl = await uploadImageToImgBB(tempProfilePicture); 
        }
        setProfilePicture(imageUrl);

        updateProfilePicture(userID, imageUrl);

        setDisplayChangeProfilePicture(false);

    }

    const handleDisplayChangeWordStatus = () => {
        setDisplayChangeWordStatus(true);
        setTempWordStatus(wordStatus);
    }

    const handleDisplayProfilePicture = () => {
        setDisplayChangeProfilePicture(true);
        setPreviewManually(profilePicture);
    }


    return (
        <>
            <img 
                src = {profilePicture} 
                alt="profile picture"
                onClick={handleDisplayProfilePicture} 
                style={{ cursor: 'pointer' }}
            />
            <Modal 
                isOpen={displayChangeProfilePicture}
                onRequestClose={() => {setDisplayChangeProfilePicture(false),  resetPreview()}}
            >
                <p> Your Profile Picture </p>
                { // Previews the Image that has been uploaded by the User
                    previewURL && (
                        <>
                            <img src={previewURL} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                        </>
                    )
                }
                <form onSubmit={handleProfilePicture}>
                    <input 
                        type="file"
                        onChange={(e) => {
                            handleImageChange(e);
                            setTempProfilePicture(e.target.files[0])
                        }}
                        accept="image/*"
                    />
                    <button type="submit"> Save </button>
                </form>
            </Modal>
            <p> Status: {wordStatus} </p>
            <button onClick={handleDisplayChangeWordStatus}> Update </button>
            <Modal 
                isOpen={displayChangeWordStatus}
                onRequestClose={() => {setDisplayChangeWordStatus(false)}}
            >
                <p> Your Status: </p>
                <form onSubmit={handleWordStatus}>
                    <input value={wordStatus}  onChange={(e) => setTempWordStatus(e.target.value)}></input>
                    <button type="submit"> Save </button>
                </form>
            </Modal>
            <p> Online Status: </p>
            <form>
                <select value={onlineStatus} onChange={(e) => handleOnlineStatus(e.target.value)}>
                    <option value="online"> 🟢 Online </option>
                    <option value="idle"> 🟡 Idle </option>
                    <option value="away"> 🟠 Away from Home</option>
                    <option value="slow"> 🔵 Slow Replies </option>
                    <option value="doNotDisturb"> 🔴 Do Not Disturb </option>
                </select>
            </form>
        </>
    )
}

export default DashboardProfile;