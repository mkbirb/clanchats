import { useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { getCustomClanEmojis } from './firebaseConfig';
import { useRouter } from 'next/router';

// Allows user to select an Emoji
const EmojiPicker = ({ onEmojiSelect }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [customEmojis, setCustomEmojis] = useState([]);

    // Get the Clan ID from the URL Parameter
    const router = useRouter();
    const {clan} = router.query;

    useEffect(() => {
        const fetchCustomEmojis = async () => {

            try {
                const fetchedEmojis = await getCustomClanEmojis(clan);

                setCustomEmojis(fetchedEmojis);
            }
            catch (error) {
                console.log("Custom Emojis cannot be fetched for Emoji Picker ", error);
            }
        }

        fetchCustomEmojis();
    }, [clan])
    return (
        <>
            <button 
                type="button" 
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className='cursor-pointer !bg-gray-200 !p-2 !rounded-full'>
                🤪
            </button>

            {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 z-50">
                    <Picker 
                    data={data} 
                    onEmojiSelect={onEmojiSelect} 
                    custom={customEmojis.length > 0 ? [{
                        id: 'clan-emojis',
                        name: 'Clan Emojis',
                        emojis: customEmojis
                    }] : []}
                    theme="light" />
                </div>
            )}
        </>
    );
};

export default EmojiPicker;