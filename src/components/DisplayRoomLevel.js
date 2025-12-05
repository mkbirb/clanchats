import { useEffect, useState } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { subscribeToRoomData } from "./firebaseConfig";
import { levelDefinition, maxLevel } from "./definitions/LevelDefinitions";


const DisplayRoomLevel = () => {
    const [roomLevel, setRoomLevel] = useState(null);
    const [experience, setExperience] = useState(null);

    const {roomID } = useCurrentUser();

    // Get the current Leveling Progress
    const nextLevelTotalXP = levelDefinition[roomLevel] || levelDefinition[maxLevel];

    const progressPercent = Math.min(
        (experience / (nextLevelTotalXP)) * 100,
        100
    );
        
    useEffect(() => {
        if (!roomID) return;

        const unsubscribe = subscribeToRoomData(roomID, (roomData) => {
            // console.log(`Room Level ${roomData.level.level} and Experience ${roomData.level.experience}`);
            setRoomLevel(roomData.level.level);
            setExperience(roomData.level.experience);
        });

        // Cleanup
        return () => unsubscribe();
    }, [roomID]);

    return (
        <>
            <div>
                <div className="flex relative group w-full bg-gray-300 rounded-full h-6 mt-2 cursor-pointer">
                    <div
                        className="bg-green-500 h-6 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    >
                    </div>
                    <p className="absolute inset-0 flex items-center justify-center text-black text-xl transition-all duration-500"> Level: {roomLevel} </p>
                    <span className="absolute text-lg left-1/2 top-full mb-2 w-max max-w-xs -translate-x-1/2 scale-0 rounded bg-gray-800 text-white px-2 py-1 transition-all duration-200 group-hover:scale-100">
                        <b> Experience: </b>{experience}/{nextLevelTotalXP}
                        {experience === levelDefinition[maxLevel] && (
                            <p className="font-bold"> 🔝 Maxed Level Reached!!</p>
                        )}
                    </span>
                </div>
            </div>
        </>
    )
}

export default DisplayRoomLevel;