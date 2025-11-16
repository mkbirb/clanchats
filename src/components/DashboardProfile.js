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
import MusicStatusSearch from "./MusicStatusSearch";
import MusicStatusDisplay from "./MusicStatusDisplay";

const DashboardProfile = () => {
    const { userID } = useCurrentUser(); 
    const [profilePicture, setProfilePicture] = useState(null);
    const [username, setUsername] = useState(null);
    const [wordStatus, setWordStatus] = useState(null);
    const [onlineStatus, setOnlineStatus] = useState(null);
    const [displayChangeStatusModal, setDisplayChangeStatusModal] = useState(false);
    const [searchMusicForStatusModal, setSearchMusicForStatusModal] = useState(false);
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
        setDisplayChangeStatusModal(false);
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

    const handleDisplayChangeStatusModal = () => {
        setDisplayChangeStatusModal(true);
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
                                    onClick={handleDisplayChangeStatusModal}
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
                isOpen={displayChangeStatusModal}
                onRequestClose={() => {setDisplayChangeStatusModal(false)}}
                className="flex items-center justify-center outline-none"
                overlayClassName="fixed inset-0 bg-white/90 flex items-center justify-center"
            >
                <div className="relative grid grid-cols-2 w-4xl !p-[5%] gap-4 !bg-white">
                    {/* Exit Button */}
                    <button
                        onClick={() => setDisplayChangeStatusModal(false)}
                        className="absolute top-2 right-4 !text-gray-600 !hover:text-gray-900 !text-3xl font-bold cursor-pointer"
                    >
                        &times;
                    </button>
                    <div className="grid place-items-center rounded-2xl bg-[#FFDC2E] gap-3">
                        <p className="!font-bold !text-black text-2xl !mt-3"> 🎶 Music Status </p>
                        <MusicStatusDisplay userID={userID} />
                        <button 
                            onClick={() => setSearchMusicForStatusModal(true)}
                            className="!bg-blue-400 !text-xl !rounded-xl !font-bold !text-white w-[50%] h-9 !mb-3 cursor-pointer">
                            Change Song 🔄
                        </button>
                    </div>

                    <div className="flex flex-col justify-center rounded-2xl bg-[#FFEB8A] gap-3">
                        <p className="text-center !font-bold !text-black text-2xl !mt-3"> 🗨️ Your Status</p>
                        <form onSubmit={handleWordStatus} className="flex flex-col justify-between items-center h-full mt-4 w-full">
                            <textarea 
                                value={tempWordStatus} 
                                onChange={(e) => setTempWordStatus(e.target.value)}
                                className="w-11/12 h-[87%] px-4 py-2 !border text-center !border-black !border-5 !bg-white rounded-lg"
                            />
                            <button type="submit" className="!bg-green-500 !text-xl !rounded-xl !font-bold !text-white w-[50%] h-9 !mb-3 cursor-pointer">Save</button>
                        </form>
                    </div>
                </div>
            </Modal>
            <Modal 
                isOpen={searchMusicForStatusModal}
                onRequestClose={() => setSearchMusicForStatusModal(false)}
                className="bg-white z-50 w-7xl !p-[2%] relative"
                overlayClassName="fixed inset-0 bg-[#F2F2F2]/80 flex items-center justify-center z-40"
            >
                {/* Exit Button */}
                <button
                    onClick={() => setSearchMusicForStatusModal(false)}
                    className="absolute top-2 right-4 !text-gray-600 !hover:text-gray-900 !text-3xl font-bold cursor-pointer"
                >
                    &times;
                </button>
                <div className="max-h-[80vh] overflow-y-auto">
                    <MusicStatusSearch userID={userID}/>
                </div>
            </Modal>
        </>
    )
}

export default DashboardProfile;