// Allows for the Image in the Chat to be enlarged when clicked

import { useEffect, useState } from "react"
import Modal from 'react-modal';

const ViewImage = ({src, alt="Image"}) => {

    const [imageBeingViewed, setImageBeingViewed] = useState(false);

    // Done to prevent Scrolling, while the View Image Modal is open
    useEffect(() => {
        if(imageBeingViewed) {
            document.body.classList.add('overflow-hidden');
        }
        else {
            document.body.classList.remove('overflow-hidden');
        }

        // Clean up
        return () => {
            document.body.classList.remove('overflow-hidden');
        }
    }, [imageBeingViewed])

    return(
        <>
            <div>
                <img
                    src={src}
                    alt={alt}
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                    onClick={() => setImageBeingViewed(true)}
                />
            </div>

            <Modal 
                isOpen={imageBeingViewed}
                onRequestClose={() => {setImageBeingViewed(false)}}
                className="flex items-center justify-center outline-none"
                overlayClassName="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            >
                
                <img 
                    src={src} 
                    alt={alt} 
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                    onClick={(e) => e.stopPropagation()} 
                />
                                
            </Modal>

        </>
    )
}

export default ViewImage;