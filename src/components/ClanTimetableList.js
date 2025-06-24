// Displays the list of Timetables for a clan

import { useEffect, useState} from "react";
import { retrieveAllClanTimetables } from "./firebaseConfig";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";

const ClanTimetableList = ({clanID}) => {
    const [clanTimetables, setClanTimetables] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const fetchedTimetables = await retrieveAllClanTimetables(clanID);

                setClanTimetables(fetchedTimetables);

                // console.log("Fetched Timetables:", fetchedTimetables);
            }
            catch (error) {
                console.log("Cannot fetch the Clan Timetables for Timetable List ", error);
            }
        }

        fetchTimetables();
    }, []);

    const handleOpenTimetable = (timetableID) => {
        console.log("Navigating to timetable:", timetableID); 
        navigateTo(router, 'SPECIFICTIMETABLE', clanID, timetableID);
    }

    return (
        <>
            <p> Clan Timetable List</p>
            {clanTimetables.length === 0 ? 
                <p> There are no Clan Timetables yet</p> : 
                clanTimetables.map((timetable, index) => (
                    <div key={index} onClick={() => handleOpenTimetable(timetable.id)}>
                        <p> {timetable.title} </p>
                        <p> {timetable.date} </p>
                    </div>
            ))}
        </>
    )
}

export default ClanTimetableList;