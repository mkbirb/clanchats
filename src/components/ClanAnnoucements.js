import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Modal from 'react-modal';
import { createClanAnnouncements, deleteClanAnnoucement, editClanAnnoucements, retrieveClanAnnoucements } from "./firebaseConfig";
import generalAnnouncementIcon from '../images/announcement.png';
import announcementIcon from '../images/announcementIcon.png';
import exclamationIcon from '../images/exclamation.png';
import useImagePreview from "../customHooks/useImagePreview";
import { uploadImageToImgBB } from "../utils/imageUpload";
import { annotateDynamicAccess } from "next/dist/server/app-render/dynamic-rendering";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getTimeFromFirestoreTimestamp } from "../utils/getTimeFromFirestoreTimestamp";

const ClanAnnoucements = ({clanData}) => {
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
                await createClanAnnouncements(clanData.id, title, description, type, bannerURL, attachmentURLs);
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
                annoucements.map((annoucement) => (
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
                                <Image src={announcementIcon} className="w-12 h-12 absolute -bottom-1 -right-1" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold"> {annoucement.title} </p>
                                <p className="italic"> {getFormattedDate(annoucement.createdAt)} {getTimeFromFirestoreTimestamp(annoucement.createdAt)}</p>
                                {/* Shortens the Description Text if it is too long */}
                                <p> {annoucement.description.length > 100 ? annoucement.description.slice(0, 100) + "..." : annoucement.description} </p>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <Modal isOpen={displayAnnoucementModal} onRequestClose = {resetAnnoucementModal}>
                {displayAnnoucementTypeSelection && !displayCreateAnnoucement && !displayViewAnnoucement && (
                    <>
                        <button onClick={() => creatingTheAnnoucement("General")}> General </button>
                        <button onClick={() => creatingTheAnnoucement("Important")}> Important </button>
                    </>
                    )
                }
                {displayViewAnnoucement && (
                    <>
                        {currentAnnoucement.banner && (
                            <img src={currentAnnoucement.banner} alt="Announcement Banner" className="w-48 h-auto mb-4" />
                        )}
                        <h2>{currentAnnoucement.title}</h2>
                        <p> {currentAnnoucement.description}</p>

                        <div className="flex gap-2 flex-wrap">
                            {currentAnnoucement.attachments?.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Attachment ${index}`}
                                className="w-24 h-24 object-cover"
                            />
                            ))}
                        </div>
                        <button onClick={() => {setDisplayViewAnnoucement(false),  setDisplayCreateAnnoucement(true), setIsEdit(true)}}> Edit </button>
                    </>
                )}
                {displayCreateAnnoucement && (
                        <>
                            <form onSubmit={handleSubmit}>
                                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                                <label htmlFor="banner"> Banner </label>
                                <input
                                    id="banner"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {previewURL && !deletedBanner && (
                                    <>
                                        <img src={previewURL} alt="Banner Preview"   width={64} height={64}/>
                                        <button onClick={handleDeleteBannerPreview} className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs">❌</button>
                                    </>)}
                                <label htmlFor="attachments"> Attachments </label>
                                <input
                                    id="attachments"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleMultipleImageChange}
                                />
                                {multiplePreviewURLs.map((preview, index) => (
                                    <div key={index} className="relative inline-block mr-2">
                                        <img src={preview.url} alt={`Attachment ${index}`} className="w-16 h-16" />
                                        <button
                                            onClick={() => handleDeleteAttachmentPreview(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs"
                                            type="button"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                                <button type="submit"> {isEdit ? "Save" : "Create"} </button>
                            </form>
                            {isEdit && <button onClick={() => handleDelete(currentAnnoucement.id)}> Delete </button>}
                        </>
                    )
                }
            </Modal>
        </>
    )
}

export default ClanAnnoucements