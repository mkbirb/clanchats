// To display to the User whether the Messages has been seen by the recipient/s

import { useEffect, useState } from "react";
import { getUserByID } from "./firebaseConfig";

const SeenIcon = ({message, currentUserID, lastSeenMessageID, showSeenIcon, userMap}) => {


    // Gets all the users who have seen the message, but excluding the current user

    const othersSeen = Object.entries(message.seenBy || {}).filter(([uid]) => uid !== currentUserID);

    const usersData = othersSeen.map(([uid, timestamp]) => {
        const user = userMap[uid];
        return user ? { ...user, readAt: timestamp?.toDate() } : null;
    }).filter(Boolean);

    // To prevent disappearing of SeenIcon prematurely
    if (!showSeenIcon) return null;

    // Only display Seen icon for the Last Seen Message
    if (message.id !== lastSeenMessageID) return null;

    // If no one seen, dont display SeenIcon
    if (othersSeen.length === 0) return null;

    if (usersData.length === 0) return null;

    return (
        <div className="seen-icon flex gap-1">
            {usersData.map(user => (
                <div key={user.uid} className="relative group flex items-center justify-center">
                    <div
                    className="rounded-full bg-gray-300 text-white flex items-center justify-center w-5 h-5 text-xs overflow-hidden"
                    >
                    {user.profilePicture ? (
                        <img
                        src={user.profilePicture}
                        alt={user.name || 'User Avatar'}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        // Displays initials if User does not have Username
                        <span>{(user.name || '?')[0]}</span>
                    )}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                        Read by {user.name || 'Unknown'} at {user.readAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SeenIcon;