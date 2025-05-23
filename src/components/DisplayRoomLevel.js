import { useEffect, useState } from "react";
import { useCurrentUser } from "../context/CurrentUserContext";
import { subscribeToRoomData } from "./firebaseConfig";
import { levelDefinition, maxLevel } from "./definitions/LevelDefinitions";


const DisplayRoomLevel = () => {
    const [roomLevel, setRoomLevel] = useState(null);
    const [experience, setExperience] = useState(null);

    const {roomID } = useCurrentUser();
        
    useEffect(() => {
        if (!roomID) return;

        const unsubscribe = subscribeToRoomData(roomID, (roomData) => {
        console.log(`Room Level ${roomData.level.level} and Experience ${roomData.level.experience}`);
        setRoomLevel(roomData.level.level);
        setExperience(roomData.level.experience);
        });

        // Cleanup
        return () => unsubscribe();
    }, [roomID]);

    return (
        <>
            <p> Level: {roomLevel} </p>
            <p> Experience: {experience} </p>
            {experience === levelDefinition[maxLevel] && (
                <p> Maxed Level Reached!!</p>
            )}
        </>
    )
}

export default DisplayRoomLevel;