// To display to the User whether the Messages has been seen by the recipient/s


const SeenIcon = ({message, currentUserID, lastSeenMessageID, showSeenIcon, groupLastSeen = null, userMap}) => {

    // The avatar displaying
    const SeenAvatar = ({ user }) => (
        <div className="relative group flex items-center justify-center">
            <div className="rounded-full bg-gray-300 text-white flex items-center justify-center w-5 h-5 text-xs overflow-hidden">
            {user.profilePicture ? (
                <img src={user.profilePicture} className="w-full h-full object-cover" />
            ) : (
                // Displays initials if User does not have Username
                <span>{(user.name || '?')[0]}</span>
            )}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                Read by {user.name || 'Unknown'}
            </div>
        </div>
    );

    // For the Direct Room Chats
    if (!groupLastSeen) {
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

        // Get the Users to appear in the same order to prevnt flickering for the Seen User Icon
        const orderedUsers = [...usersData].sort((a, b) => a.id.localeCompare(b.id));

        return (
            <div className="seen-icon flex gap-1">
                {orderedUsers.map(user => (
                    <SeenAvatar key={user.id} user={user} />
                ))}
            </div>
        );
    }
    // For the Group Chats
    else if (groupLastSeen) {

        // Get which users from the group Chat that has seen message
        const seenUsers = Object.entries(groupLastSeen)
        .filter(([uid, lastSeenID]) => uid !== currentUserID && lastSeenID === message.id)
        .map(([uid]) => userMap[uid])
        .filter(Boolean);

        if (seenUsers.length === 0) return null;

        const orderedSeen = [...seenUsers].sort((a, b) => a.id.localeCompare(b.id));

        return (
            <div className="seen-icon flex gap-1">
            {orderedSeen.map(user => (
                <SeenAvatar key={user.id} user={user} />
            ))}
            </div>
        );
    }
}

export default SeenIcon;