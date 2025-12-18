import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image';
import Modal from 'react-modal';
import { createClanAnnouncements, deleteClanAnnoucement, editClanAnnoucements, getCachedUserByID, retrieveClanAnnoucements } from "./firebaseConfig";
import generalAnnouncementIcon from '../images/announcement.png';
import announcementIcon from '../images/announcementIcon.png';
import exclamationIcon from '../images/exclamation.png';
import useImagePreview from "../customHooks/useImagePreview";
import { uploadImageToImgBB } from "../utils/imageUpload";
import { annotateDynamicAccess } from "next/dist/server/app-render/dynamic-rendering";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getTimeFromFirestoreTimestamp } from "../utils/getTimeFromFirestoreTimestamp";
import ViewImage from "./ViewImage";

const ClanAnnoucements = ({clanData, currentUser}) => {
    const [displayAnnoucementModal, setDisplayAnnoucementModal] = useState(false);
    const [displayAnnoucementTypeSelection, setAnnoucementTypeSelection] = useState(true);
    const [displayCreateAnnoucement, setDisplayCreateAnnoucement] = useState(false);
    const [displayViewAnnoucement, setDisplayViewAnnoucement] = useState(false);
    const [annoucements, setAnnoucements] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    // For the displaying of the current Annoucement being viewed
    const [currentAnnoucement, setCurrentAnnoucement] = useState(null);

    // For the fields for creating an Annoucement
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("General");
    const [attachments, setAttachments] = useState("");
    const [banner, setBanner] = useState("");

    const [deletedBanner, setDeletedBanner] = useState(false);

    // Stores a list of Authors of the Announcements
    const [authorMap, setAuthorMap] = useState({});

    const bannerFileInputRef = useRef(null);

    const attachmentsFileInputRef = useRef(null);

    const {
        imageFile,
        previewURL,
        multiplePreviewURLs,
        setMultiplePreviewURLs,
        setPreviewManually,
        handleImageChange,
        handleMultipleImageChange,
        resetPreview,
        resetMultiplePreview
    } = useImagePreview();

    const fetchAnnoucements = async () => {
        try {
            const fetchedAnnoucements = await retrieveClanAnnoucements(clanData.id);

            // Sort the Announcements by Latest First
            fetchedAnnoucements.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                return dateB - dateA;  
            });

            setAnnoucements(fetchedAnnoucements);
        }
        catch (error) {
            console.log("Cannot fetch the Clan Annoucements ", error);
        }
    }

    useEffect(() => {
        if (clanData?.id) {
            fetchAnnoucements();
        }
    }, [clanData.id]);

    // Load the Authors for the Announcements once
    useEffect(() => {
        const loadAuthors = async () => {
            const uniqueUserIDs = [...new Set(annoucements.map(a => a.userID))];
            
            const entries = await Promise.all(
                uniqueUserIDs.map(async (id) => {
                    const user = await getCachedUserByID(id);
                    return [id, user];
                })
            );

            setAuthorMap(Object.fromEntries(entries));
        }

        if(annoucements.length > 0) {
            loadAuthors();
        }
    }, [annoucements])

    const resetAnnoucementModal = () => {
        setDisplayAnnoucementModal(false);
        setAnnoucementTypeSelection(true);
        setDisplayCreateAnnoucement(false);

        // Reset the fields
        setTitle("");
        setDescription("");
        if (!isEdit) {
            setType("");  
        }
        setAttachments("");
        setBanner("");
        
        resetPreview();
        setMultiplePreviewURLs([]);

        // Clear the selected files
        if (bannerFileInputRef.current) {
            attachmentsFileInputRef.current.value = null;
        }

        if (attachmentsFileInputRef.current) {
            attachmentsFileInputRef.current.value = null;
        }


        // For the deletion of images, where user needs to save first for changes to be kept
        setDeletedBanner(false);
    }

    const handleDelete = async (annoucementID) => {
        try {
            await deleteClanAnnoucement(clanData.id, annoucementID);
        }
        catch (error) {
            console.log("Cannot delete Clan Annoucement ", error);
        }
        
        // Refresh after deleting
        fetchAnnoucements();

        resetAnnoucementModal();
    }

    const handleDeleteBannerPreview = () => {
        setDeletedBanner(true);
    };

    const handleDeleteAttachmentPreview = (indexToRemove) => {
        setMultiplePreviewURLs(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let bannerURL = banner;

            if (imageFile && !deletedBanner) {
                bannerURL = await uploadImageToImgBB(imageFile);
            }

            if (deletedBanner) {
                bannerURL = ""; 
            }

            let attachmentURLs = [];

            if (multiplePreviewURLs.length > 0) {
                const newFiles = multiplePreviewURLs.filter(preview => preview.file);

                const uploadPromises = newFiles.map(preview => uploadImageToImgBB(preview.file));
                const newUploadedURLs = await Promise.all(uploadPromises);

                // Existing URLs are those with null file but existing url string
                const existingURLs = multiplePreviewURLs
                    .filter(preview => !preview.file && preview.url)
                    .map(preview => preview.url);

                attachmentURLs = [...existingURLs, ...newUploadedURLs];
            }

            if (isEdit) {
                await editClanAnnoucements(clanData.id, currentAnnoucement.id, title, description, type, bannerURL, attachmentURLs);
            } 
            else {
                await createClanAnnouncements(clanData.id, currentUser.id, title, description, type, bannerURL, attachmentURLs);
            }

            fetchAnnoucements();
            resetAnnoucementModal();
        } 
        catch (error) {
            console.log("Cannot save announcement", error);
        }
    };


    const creatingTheAnnoucement = (choosenType) => {
        resetPreview(); 
        resetMultiplePreview(); 
        setDisplayCreateAnnoucement(true);
        setType(choosenType);
        setIsEdit(false);
    }

    const openExistingAnnoucement = (annoucement) => {
        setDisplayAnnoucementModal(true);
        setDisplayViewAnnoucement(true);
        setTitle(annoucement.title);
        setDescription(annoucement.description);
        setCurrentAnnoucement(annoucement);
        setIsEdit(true);
        setType(annoucement.type);

        if (annoucement.banner) {
            setPreviewManually(annoucement.banner);  
            setBanner(annoucement.banner);
        }

        if (annoucement.attachments && annoucement.attachments.length > 0) {
            const previews = annoucement.attachments.map(url => ({ file: null, url }));
            setMultiplePreviewURLs(previews);
            setAttachments(annoucement.attachments);
        }
    }

    return (
        <>
            <div className="flex flex-2 h-[10vh]">
                <div className="flex flex-2 h-[10vh]">
                    <Image 
                        src={announcementIcon} 
                        className="h-[10%] w-[12%]"/>
                    <div>
                        <p className="font-bold text-2xl !mt-7 !mb-2"> Announcements </p>
                        <hr className="!bg-[#f79326] !h-3 rounded-2xl !border-0 w-[100%]" />
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <button 
                        onClick={() => {setDisplayAnnoucementModal(true), setDisplayViewAnnoucement(false)}}
                        className="!bg-black !text-white self-center !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"> Add </button>
                </div>
            </div>
            {annoucements.length === 0 ? (
                <p> There are No Announcements yet </p>
            ): (
                annoucements.map((annoucement) => {
                    const author = authorMap[annoucement.userID];
                    
                    return (
                        <div onClick={() => openExistingAnnoucement(annoucement)} key={annoucement.id} className="mb-4 cursor-pointer">
                            <hr className="!bg-black !h-1.5 !border-0 w-[100%] !mt-3" />
                            <div className="flex flex-2 !mt-3 gap-3">
                                <div className="relative inline-block">
                                    {annoucement.type === "General" && (
                                        <Image src={generalAnnouncementIcon} alt="Announcement Icon" className="w-24 h-24" />
                                    )}
                                    {annoucement.type === "Important" && (
                                        <Image src={exclamationIcon} alt="Important Icon" className="w-24 h-24"/>
                                    )}
                                    <img src={author?.profilePicture} className="!w-10 !h-10 absolute !rounded-full -bottom-1 -right-1" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold"> {annoucement.title} </p>
                                    <p className="italic"> {getFormattedDate(annoucement.createdAt)} {getTimeFromFirestoreTimestamp(annoucement.createdAt)}</p>
                                    {/* Shortens the Description Text if it is too long */}
                                    <p> {annoucement.description.length > 100 ? annoucement.description.slice(0, 100) + "..." : annoucement.description} </p>
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
            <Modal isOpen={displayAnnoucementModal} onRequestClose = {resetAnnoucementModal}>
                {displayAnnoucementTypeSelection && !displayCreateAnnoucement && !displayViewAnnoucement && (
                    <>
                        <div className="flex flex-2 flex-col justify-center items-center h-full">
                            <p className="font-bold text-3xl !mb-5"> Creating Announcement </p>
                            <p className="!mb-5 text-lg"> Select Announcement Type </p>
                            <div className="flex flex-row gap-x-5">
                                <div 
                                    className="flex flex-col items-center bg-amber-400 cursor-pointer rounded-2xl"
                                    onClick={() => creatingTheAnnoucement("General")}>
                                    <Image 
                                        src={announcementIcon} 
                                        alt="GeneralAnnouncementIcon" 
                                        className="w-54 h-54"/>
                                    <p className="font-bold text-xl text-white"> General </p>
                                </div>
                                <div
                                    className="flex flex-col items-center bg-amber-400 cursor-pointer rounded-2xl" 
                                    onClick={() => creatingTheAnnoucement("Important")}>
                                    <Image
                                        src={exclamationIcon}
                                        alt="GeneralAnnouncementIcon" 
                                        className="w-54 h-54 !p-5"/>
                                    <p className="font-bold text-xl text-white"> Important </p>
                                </div>
                            </div>
                        </div>
                    </>
                    )
                }
                {displayViewAnnoucement && (() => {
                    const author = authorMap[currentAnnoucement.userID];
                        return (
                            <>
                                <div className="flex flex-row">
                                    <div className="flex flex-col items-center">
                                        {currentAnnoucement.banner && (
                                            <img src={currentAnnoucement.banner} 
                                                alt="Announcement Banner"
                                                className="!w-[50vw] !h-38 !mb-4 !object-cover !rounded-lg"  />
                                        )}
                                        <p className="text-2xl font-bold !mb-3">{currentAnnoucement.title}</p>
                                        <div className="flex flex-col items-center !mb-3">
                                            <div className="flex flex-row items-center !gap-2 ">
                                                <img src={author?.profilePicture} className="!w-11 !h-10 !rounded-full" />
                                                <p><b>Author:</b> {author.username}</p>
                                            </div>
                                            <p> {getFormattedDate(currentAnnoucement.createdAt)} {getTimeFromFirestoreTimestamp(currentAnnoucement.createdAt)}</p>
                                        </div>
                                        <p className="text-lg !rounded-2xl bg-gray-100 !w-[50vw] !h-auto !p-3 text-center"> {currentAnnoucement.description}</p>
                                    </div>
                                    <div className="flex flex-col items-stretch !w-[50vw]">
                                        <div className="flex justify-end items-start !h-38 gap-2 mb-3">
                                            <button
                                                onClick={() => {
                                                    setDisplayViewAnnoucement(false)
                                                    setDisplayCreateAnnoucement(true)
                                                    setIsEdit(true)
                                                }}
                                                className="!bg-blue-500 !text-white !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={resetAnnoucementModal}
                                                className="!bg-black !text-white !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"
                                                >Close</button>
                                        </div>
                                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 !ml-5 flex-wrap justify-center ">
                                            {currentAnnoucement.attachments?.map((url, index) => (
                                                <ViewImage
                                                    key={index}
                                                    src={url}
                                                    alt={`Attachment ${index}`}
                                                    className="w-54 h-54 object-cover"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                )()}
                {displayCreateAnnoucement && (
                        <>
                            <form onSubmit={handleSubmit} className="h-full">
                                <div className="flex relative !w-full !h-full flex-col items-center">
                                    <div className="absolute top-0 right-0 flex gap-2">
                                        <button 
                                            type="submit"
                                            className="!bg-green-500 !text-white !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"> {isEdit ? "Save" : "Create"} </button>
                                        <button
                                            onClick={resetAnnoucementModal}
                                            className="!bg-black !text-white !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"
                                            >Close</button>
                                    </div>
                                    <div className="flex flex-row gap-2 !mb-3">
                                        <label className="font-bold text-2xl"> Title: </label>
                                        <input 
                                            type="text" 
                                            placeholder="Title" 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="!text-2xl"/>
                                    </div>
                                    <div className="flex flex-row w-full !gap-3">
                                        <div className="flex flex-col gap-2 w-1/2">
                                            <label className="font-bold text-center !text-lg"> Description: </label>
                                            <textarea
                                                placeholder="Description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="!text-xl !rounded-2xl !bg-gray-100 !p-3 w-full !h-100 !resize-none text-center"
                                            />
                                        </div>
                                        <div className="flex flex-col w-1/2 items-center justify-center">
                                            <label 
                                                htmlFor="banner"
                                                className="font-bold text-center !text-xl !mb-3"> Banner: </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                ref={bannerFileInputRef}   
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => bannerFileInputRef.current.click()}
                                                className="!bg-blue-500 !text-white !font-semibold px-4 py-2 !mb-3 !rounded-lg !hover:bg-blue-600  w-1/4 !p-2 !transition cursor-pointer"
                                            >
                                                Choose File
                                            </button>
                                            <div className="flex flex-row">
                                                {(previewURL && !deletedBanner) ? (
                                                    <>
                                                        <div className="relative">
                                                            <img 
                                                                src={previewURL}
                                                                alt="Banner Preview"   
                                                                className="!w-78 !h-24 object-cover rounded-md"
                                                            />
                                                            <button 
                                                                onClick={handleDeleteBannerPreview} 
                                                                className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs cursor-pointer">❌</button>
                                                        </div>
                                                    </>): (
                                                        <>
                                                            <p> No Banner Uploaded </p>
                                                        </>
                                                    )}
                                            </div>
                                            <label 
                                                htmlFor="attachments"
                                                className="font-bold text-lg !mb-3"> Attachments: </label>
                                            <input
                                                id="attachments"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={attachmentsFileInputRef}  
                                                onChange={handleMultipleImageChange}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => attachmentsFileInputRef.current.click()}
                                                className="!bg-blue-500 !text-white !font-semibold px-4 py-2 !mb-3 !rounded-lg !hover:bg-blue-600  w-1/4 !p-2 !transition cursor-pointer"
                                            >
                                                Choose File
                                            </button>
                                            <div className="flex flex-row">
                                                {multiplePreviewURLs.map((preview, index) => (
                                                    <div key={index} className="relative inline-block mr-2">
                                                        <img src={preview.url} alt={`Attachment ${index}`} className="w-26 h-26" />
                                                        <button
                                                            onClick={() => handleDeleteAttachmentPreview(index)}
                                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs cursor-pointer"
                                                            type="button"
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                ))}
                                                {multiplePreviewURLs.length <= 0 && (
                                                     <p> No Attachments Uploaded </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {isEdit && (
                                        <button 
                                            onClick={() => handleDelete(currentAnnoucement.id)}
                                            className="absolute bottom-4 right-4 !bg-red-600 !text-white !font-bold px-4 py-2 !mb-3 !rounded-lg w-32 !p-2 !transition cursor-pointer"> Delete </button>)}
                                </div>
                            </form>
                        </>
                    )
                }
            </Modal>
        </>
    )
}

export default ClanAnnoucements