import { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

// Allows user to select an Emoji
const EmojiPicker = ({ onEmojiSelect }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    return (
        <>
            <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)}>
                🤪
            </button>

            {showEmojiPicker && (
                <Picker data={data} onEmojiSelect={onEmojiSelect} theme="light" />
            )}
        </>
    );
};

export default EmojiPicker;