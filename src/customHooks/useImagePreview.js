import { useState } from 'react';

// Allows for the Image that has been uploaded by the User to be displayed
const useImagePreview = () => {
    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);
    const [multiplePreviewURLs, setMultiplePreviewURLs] = useState([]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Check if the File is an Image
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                const previewURL = URL.createObjectURL(file);

                console.log('Preview URL:', previewURL); 

                setPreviewURL(previewURL);   
            }
            else {
                console.log('Invalid File Type uploaded'); 
            }
        }
    };

    // For when the User uploads multiple Pictures that needs to be previewed
    const handleMultipleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));
        setMultiplePreviewURLs(prev => [...prev, ...newPreviews]);
    };

    const resetPreview = () => {
        setImageFile(null);
        setPreviewURL(null);
    };

    // Resets the multiple images that the User has uploaded
    const resetMultiplePreview = () => {
        multiplePreviewURLs.forEach(p => URL.revokeObjectURL(p.url));
        setMultiplePreviewURLs([]);
    }

    // Allows the setting of the Image Preview through URL
    const setPreviewManually = (url) => {
        setImageFile(null);
        setPreviewURL(url);
    };

    return {
        imageFile,
        previewURL,
        multiplePreviewURLs,
        setMultiplePreviewURLs,
        setPreviewManually,
        handleImageChange,
        handleMultipleImageChange,
        resetPreview,
        resetMultiplePreview
    }
};


export default useImagePreview;