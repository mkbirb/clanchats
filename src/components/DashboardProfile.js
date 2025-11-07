// Displays the Users Profile on their dashboard
// Where they can change Profile Picture or update Statuses

import { useEffect, useState } from "react";
import { getUserByID, updateOnlineStatus, updateProfilePicture, updateWordStatus } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";
import Modal from 'react-modal';
import { uploadImageToImgBB } from "../utils/imageUpload";
import useImagePreview from "../customHooks/useImagePreview";
import editIcon from '../images/editIcon.png';
import Image from 'next/image';
import MusicStatusSearch from "./musicStatus";

const DashboardProfile = () => {
    const { userID } = useCurrentUser(); 
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState(null);
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
                setUsername(userData.username);
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
            <div className="place-items-center">
                <div className="grid grid-cols-2 w-200 h-90 bg-amber-500 place-items-center rounded-full">
                    <div className="w-62 h-62 rounded-full overflow-hidden relative">
                        <img
                            src={profilePicture} 
                            alt="profile picture"
                            onClick={handleDisplayProfilePicture} 
                            style={{ cursor: 'pointer' }}
                            className="rounded-full aspect-square object-cover"
                        />
                        <Image
                            src= {editIcon} 
                            alt="profilePictureEditIcon"
                            height={80}
                            width={80}
                            style={{ cursor: 'pointer' }}
                            onClick={handleDisplayProfilePicture} 
                            className="absolute bottom-1 right-1"
                        />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-black text-center w-90"> Welcome </p>
                        <p className="font-mono text-5xl font-bold text-white text-center w-90"> {username} !!</p>
                        <div className="bg-amber-300 h-70 w-130 rounded-full place-items-center !mt-5">
                            <p className="font-bold text-white text-2xl !mb-3"> Online Status: </p>
                            <form>
                                <select 
                                    value={onlineStatus} 
                                    onChange={(e) => handleOnlineStatus(e.target.value)}
                                    className="!mb-3 !font-bold !text-xl">
                                    <option value="online"> 🟢 Online </option>
                                    <option value="idle"> 🟡 Idle </option>
                                    <option value="away"> 🟠 Away from Home</option>
                                    <option value="slow"> 🔵 Slow Replies </option>
                                    <option value="doNotDisturb"> 🔴 Do Not Disturb </option>
                                </select>
                            </form>
                            <div className="relative">
                                <p className="font-bold text-white text-2xl !mb-3 text-center"> Status: </p>
                                <Image
                                    src= {editIcon} 
                                    alt="statusEditIcon"
                                    height={50}
                                    width={50}
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleDisplayChangeWordStatus}
                                    className="absolute -bottom-5 right-20 !mb-3"
                                />
                            </div>
                            {wordStatus?.length > 0 ? 
                                (<p className="text-white text-xl italic text-center w-80"> {wordStatus} </p>) :
                                (<p className="text-black text-xl italic !mt-10"> Set your Status to speak your mind... </p>) }
                        </div>
                    </div>
                </div> 
            </div>
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
            <Modal 
                isOpen={displayChangeWordStatus}
                onRequestClose={() => {setDisplayChangeWordStatus(false)}}
            >
                <MusicStatusSearch userID={userID}/>
                <p> Your Status: </p>
                <form onSubmit={handleWordStatus}>
                    <input value={tempWordStatus}  onChange={(e) => setTempWordStatus(e.target.value)}></input>
                    <button type="submit"> Save </button>
                </form>
            </Modal>
        </>
    )
}

export default DashboardProfile;