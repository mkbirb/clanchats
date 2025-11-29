export const sortRoomsByLatest = (rooms, prevRooms) => {
    if (!rooms || rooms.length === 0) return rooms;

    const sorted = [...rooms].sort((a, b) => {
        const timeA = a.latestMessage?.createdAt?.seconds || 0;
        const timeB = b.latestMessage?.createdAt?.seconds || 0;
        return timeB - timeA;
    });

    // Prevent re render if the order hasn't changed
    const isSameOrder = prevRooms?.every((room, idx) => room.roomId === sorted[idx]?.roomId);
    if (isSameOrder) return null;

    return sorted;
};