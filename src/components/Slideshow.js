// Used for the Image Slideshow

import React, { useState, useEffect } from "react";
import useImagePreview from "../customHooks/useImagePreview";
import { ClanSlidesDefault } from "./definitions/ClanSlideDefault";
import Modal from 'react-modal';
import { uploadImageToImgBB } from "../utils/imageUpload";
import { getClanSlides, saveClanSlides } from "./firebaseConfig";
import { useCurrentUser } from "../context/CurrentUserContext";
import { useRouter } from "next/router";

const Slideshow = ({images = ClanSlidesDefault, interval = 3000}) => {
    console.log("Images length:", images?.length);
    console.log("Images passed to Slideshow:", images);
    // Keeps track of the slide the Slideshow is up to
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayAddImagesToSlideshow, setDisplayAddImagesToSlideshow] = useState(false);
    const {multiplePreviewURLs, setMultiplePreviewURLs, handleMultipleImageChange, resetMultiplePreview } = useImagePreview();
    const [slideshowImages, setSlideshowImages] = useState([]);
    // Allows for the updating of slides
    const [refreshSlides, setRefreshSlides] = useState(false);

    // Get the Clan ID from the URL Parameter
    const router = useRouter();
    const {clan} = router.query;

    // For the autoplaying of the slideshow
    useEffect(() => {
        // When incrementing for slideshow, if the Index equals the Length of the Images avaliable then restart from 0.
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                return prevIndex === slideshowImages.length - 1 ? 0 : prevIndex + 1; 
            })
        }, interval);

        // Cleanup function
        return () => clearInterval(timer);
    },[slideshowImages.length, interval])

    // Get the Slides
    useEffect(() => {
        const fetchSlides = async() => {
            try {
                const fetchedSlides = await getClanSlides(clan);

                const validSlides = Array.isArray(fetchedSlides) && fetchedSlides.length > 0 
                    ? fetchedSlides 
                    : ClanSlidesDefault;

                // Transform into the preview format, so that the fetched slides appear in the Slide Editor Modal
                const previewArray = validSlides.map(url => ({
                    url,
                    fromFireStore: true
                }));

                setMultiplePreviewURLs(previewArray); 

                setSlideshowImages(validSlides);
            }
            catch (error) {
                console.log("Could not get Slides ", error);
            }
        }

        fetchSlides();
    }, [displayAddImagesToSlideshow, refreshSlides])



    const goPreviousSlide = () => {
        setCurrentIndex(index =>
            index === 0 ? slideshowImages.length - 1 : index - 1
        );
    };

    const goNextSlide = () => {
        setCurrentIndex(index =>
            index === slideshowImages.length - 1 ? 0 : index + 1
        );
    };

    // For the reordering of the Slides of the Slideshow
    const moveImage = (index, direction) => {
        setMultiplePreviewURLs(prev => {
            const newArr = [...prev];
            
            // The Direction is where if "-1", then new Index would be previous and vice versa
            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= newArr.length) return newArr;

            // Array destructuring to swap two items in place
            [newArr[index], newArr[newIndex]] = [newArr[newIndex], newArr[index]];
            return newArr;
        });
    };

    const removeImage = (index) => {
        setMultiplePreviewURLs(prev => {
            URL.revokeObjectURL(prev[index].url);
            
            // Return the array without the Element Index that we want to remove
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleAddSlides = async (e) => {
        e.preventDefault();

        const uploadedURLs = [];

        for (const image of multiplePreviewURLs) {
            if (image.fromFireStore) {
                // Reuse the Image URL, if we have already uploaded that image
                uploadedURLs.push(image.url);
            }
            else {
                try {
                    const uploadedURL = await uploadImageToImgBB(image.file);
                    uploadedURLs.push(uploadedURL);
                }
                catch(error) {
                    console.log("Cannot save the Slides ", error);
                }
            }
        }

        console.log("Saving uploaded slides:", uploadedURLs);

        await saveClanSlides(clan, uploadedURLs);

        setRefreshSlides(prev => !prev);

        setDisplayAddImagesToSlideshow(false);
    }

    return (
        <>
            <Modal
                isOpen={displayAddImagesToSlideshow}
                onRequestClose={() => {setDisplayAddImagesToSlideshow(false),  resetMultiplePreview()}}
            >
                <p> Your Slideshow Pictures </p>
                { // Previews the Image that has been uploaded by the User
                    multiplePreviewURLs.length > 0 && (
                        <ul>
                            {multiplePreviewURLs.map((item, index) => (
                                <li key={index}>
                                    <img src={item.url} alt={`Preview ${index}`} style={{ width: '100px' }} />
                                    <button onClick={() => moveImage(index, -1)} disabled={index === 0}>↑</button>
                                    <button onClick={() => moveImage(index, 1)} disabled={index === multiplePreviewURLs.length - 1}>↓</button>
                                    <button onClick={() => removeImage(index)}>✕</button>
                                </li>
                                
                            ))}
                        </ul>
                    )
                }
                <form onSubmit={handleAddSlides}>
                    <input 
                        type="file"
                        multiple
                        onChange={(e) => {
                            handleMultipleImageChange(e);
                        }}
                        accept="image/*"
                    />
                    <button type="submit"> Save </button>
                </form>
            </Modal>
            {slideshowImages.length > 0 && (
                <img
                    src={slideshowImages[currentIndex]}
                    alt={`Slide ${currentIndex}`}
                    className="!mt-5 gap-3 w-[95%] !h-[80%]"
                />
            )}
            <div className="flex flex-row w-full items-center !mt-3 relative !mb-3">
                <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-4">
                    <button onClick={goPreviousSlide} className="!text-3xl !font-bold !bg-orange-300 !text-white w-[5vw] !rounded-3xl text-center cursor-pointer"> &lt; </button>
                    <button onClick={goNextSlide} className="!text-3xl !font-bold !bg-orange-300 !text-white w-[5vw] !rounded-3xl text-center cursor-pointer"> &gt; </button>
                </div>
                <div className="flex flex-1 justify-end">
                    <button onClick={() => setDisplayAddImagesToSlideshow(true)} className="!text-3xl !font-bold !bg-orange-400 !text-white w-[15%] !rounded-3xl text-center cursor-pointer"> + </button>
                </div>
               
            </div>

        </>
    )
}

export default Slideshow;