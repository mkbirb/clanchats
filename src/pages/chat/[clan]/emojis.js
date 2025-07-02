import React, { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../../../context/CurrentUserContext";
import { createCustomClanEmoji, getCustomClanEmojis } from "../../../components/firebaseConfig";
import { uploadImageToImgBB } from "../../../utils/imageUpload";
import { useRouter } from "next/router";
import { navigateTo } from "../../../components/Routes";

const clanemojis = () => {

    const [file, setFile] = useState(null);
    const [name, setName] = useState("");
    const [keywords, setKeywords] = useState("");

    const [customEmojis, setCustomEmojis] = useState([]);

    const fileInputRef = useRef(null);

    // Gets the Clan ID from the URL Params, which should be same as the Dynamic Folder in Next.js Pages Folder Structure!
    const router = useRouter();
    const {clan} = router.query;

    useEffect(() => {
        const displayCustomEmojis = async () => {
            try {
                const emojisRetrieved = await getCustomClanEmojis(clan);

                setCustomEmojis(emojisRetrieved);
            }
            catch (error) {
                console.log("Cannot display Clan Custom Emojis ", error);
            }
        }

        displayCustomEmojis();
    }, [clan])


    const handleUpload = async (e) => {
        e.preventDefault();

        try {

            let imageUrl = null;
            imageUrl = await uploadImageToImgBB(file);
            
            const newEmoji = {
                id: name.toLowerCase(),
                name,
                shortcodes: [name.toLowerCase()],
                keywords: keywords.split(",").map(k => k.trim().toLowerCase()),
                skins: [{ src: imageUrl }],
            };

            await createCustomClanEmoji(clan, name, keywords, imageUrl);

            console.log("The Clan ID retrieved from Parameters is ", clan);

            // Immediately update
            setCustomEmojis((prev) => [...prev, newEmoji]);

            alert("Custom Emoji uploaded!");
        }
        catch (error) {
            console.log("Cannot upload Custom Emoji ", error);
        }

        setFile(null);

        // Also clear the File Input Name being displayed
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; 
         }
        setName("");
        setKeywords("");
    }

    return (
        <>
            <button onClick={() => navigateTo(router, 'CHAT', clan)}> To Dashboard</button>
            <p> Clan Emojis </p>
            <p> Add new Custom Emoji</p>
            <form onSubmit={handleUpload}>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} ref={fileInputRef} required/>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="text" placeholder="Keywords (comma separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} required />
                <button type="submit"> Add </button>
            </form>

            <p> The Custom Emojis </p>
            {customEmojis.length === 0 && <p> No custom emojis yet</p>}
            {customEmojis.map((emoji) => (
                <>
                    <img
                    src={emoji.skins[0]?.src}
                    alt={emoji.name}
                    style={{ width: 50, height: 50 }}
                    />
                    <div>:{emoji.id}:</div>
                </>
            ))}
        </>
    )
}

export default clanemojis;