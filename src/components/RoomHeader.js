import { useEffect, useState } from "react";
import DisplayRoomLevel from "./DisplayRoomLevel";
import PresenceDisplay from "./PresenceDisplay";
import { getUserByID } from "./firebaseConfig";

const RoomHeader = ({participantData, targetUserID, roomType}) => {
    const [targetUser, setTargetUser] = useState(null);

    useEffect(() => {
        const fetchTargetUser = async () => {
            const targetUser = await getUserByID(targetUserID);

            setTargetUser(targetUser);
        }

        fetchTargetUser();
    }, [targetUserID]);

    return (
        <>
            {roomType === "group" ? (<>
            {Object.values(participantData).map((person) => (
                <>
                    <p> {person.username}</p>
                    <PresenceDisplay userID={person.id} shortened={false} />
                </>
            ))}
            </>) : (
                <>
                    <div className="flex flex-row flex-shrink min-w-0 w-full bg-amber-500 !p-3">
                        <img 
                            src={targetUser?.profilePicture}
                            alt={`${targetUser?.name} profilePicture`} 
                            className="!rounded-full !object-cover !w-20 !h-19" />
                        <div className="flex flex-col items-center min-w-0 flex-1">
                            <p className="font-bold text-xl"> {targetUser?.username}</p>
                            <PresenceDisplay userID={targetUserID} shortened={false} />
                            <div className="relative group w-full text-center">
                                <p className="!truncate w-full italic cursor-pointer"> {targetUser?.wordStatus}</p>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1
                                                hidden group-hover:block
                                                bg-black text-white text-xs px-2 py-1 rounded shadow-lg
                                                whitespace-normal z-50">
                                    {targetUser?.wordStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DisplayRoomLevel />
                </>)}
        </>
    )
}


export default RoomHeader;