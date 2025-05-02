import React from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const ReactionPicker = ({onSelect}) => {
    return (
        <Picker
            data={data}
            onEmojiSelect={(emoji) => onSelect(emoji.native)} 
            theme="light"
            // Disables the Emoji Picker Popup
            previewPosition="none"
        />
    )
}

export default ReactionPicker;