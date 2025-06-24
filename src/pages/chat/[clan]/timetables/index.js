import React, { useState, useEffect } from "react";
import { createTimetableTask } from "../../../../components/firebaseConfig";
import ClanTimetableList from "../../../../components/ClanTimetableList";
import ReusableTaskList from "../../../../components/ReusableTaskList";
import { useRouter } from "next/router";
import CreateTimetable from "../../../../components/CreateTimetable";

const TimetableDashboard = () => {
    const [reusableTaskTitle, setReusableTaskTitle ] = useState();
    const [reusableTaskDuration, setReusableTaskDuration] = useState(0);
    const [reusableTaskDescription, setReusableTaskDescription] = useState("");

    const router = useRouter();
    const { clan } = router.query;

    const handleReusableTaskSubmit = async (e) => {
        // e.preventDefault();
        try {
            await createTimetableTask(clan, reusableTaskTitle, reusableTaskDuration, reusableTaskDescription);
        }
        catch(error) {
            console.log("Could not create a new Reusable Task ", error)
        }
    }
    
    return (
        <>
            <p> Timetable Dashboard </p>
            <ClanTimetableList clanID={clan} />
            <CreateTimetable clanID={clan}/>
            <ReusableTaskList clanID={clan}/>
            <p> Create Reusable Events </p>
            <form onSubmit={handleReusableTaskSubmit}>
                <input type="text" placeholder="Task Title" onChange={(e) => setReusableTaskTitle(e.target.value)} />
                <label htmlFor="duration"> Duration </label>
                <input type="number" id="duration" onChange={(e) => setReusableTaskDuration(e.target.value)}/>
                <input type="text" placeholder="Description" onChange={(e) => setReusableTaskDescription(e.target.value)} />
                <button type="submit"> Submit </button>
            </form>
        </>
    )
}

export default TimetableDashboard;