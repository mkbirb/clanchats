import { useState } from 'react';

// Allows for the Image that has been uploaded by the User to be displayed
const useImagePreview = () => {
    const [imageFile, setImageFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(null);

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

    const resetPreview = () => {
        setImageFile(null);
        setPreviewURL(null);
    };

    // Allows the setting of the Image Preview through URL
    const setPreviewManually = (url) => {
        setImageFile(null);
        setPreviewURL(url);
    };

    return {
        imageFile,
        previewURL,
        setPreviewManually,
        handleImageChange,
        resetPreview
    }
};


export default useImagePreview;