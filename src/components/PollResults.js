import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { closePoll, deletePoll, getUserByID, subscribeToPoll } from "./firebaseConfig";

const PollResults = ({pollID, clanData}) => {

    const [poll, setPoll] = useState(null);

    // Cache the display namess
    const [nameMap, setNameMap] = useState({});

    // Live updates for Poll
    useEffect(() => {
        const unsub = subscribeToPoll(pollID, clanData.id, setPoll);

        return () => unsub();
    }, [pollID]);

    useEffect(() => {
        if (poll && poll.closedDate && poll.isOpen) {
            isPollDisabledByDate();
        }
    }, [poll]);

    if (!poll) return <p>Loading...</p>;

    // Convert into an Array for usage for Recharts
    const voteCounts = poll.options.map(option => {

        const voters = [];

        if (poll.voters) {
            for (const [userId, selectedOptions] of Object.entries(poll.voters)) {
                if (selectedOptions.includes(option)) {
                    voters.push(userId); 
                }
            }
        }
        return { option, votes: voters.length, voters };
    });


    const totalVotes = voteCounts.reduce((sum, v) => sum + v.votes, 0);

    // Custom Tooltip that displays list of Users who voted for a specific option

    // Active is whether the user has hovered over the bar
    const CustomTooltip = ({active, payload}) => {

        useEffect(() => {
            if (!(active && payload && payload.length)) return;
            const { voters = [] } = payload[0].payload;

            voters.forEach(async (voter) => {
                // If already cached, no need to fetch
                if (nameMap[voter]) return;

                try {
                    const userData = await getUserByID(voter);

                    setNameMap((prev) => ({
                        ...prev,
                        [voter]: userData?.name || uid
                    }))
                }
                catch (error) {
                    console.log("Cannot get the usernames for the Poll Voters ", error)
                }
            })
        }, [active, payload, nameMap])
        if (!(active && payload && payload.length)) return null;

        const { option, votes, voters = [] } = payload[0].payload;

        return (
            <div className="bg-white border border-gray-300 p-2.5">
                <p>{option}: {votes} vote{votes !== 1 && "s"}</p>
                <p> Voted by </p>
                {voters.length > 0 && (
                    <ul>
                        {voters.map((voter, idx) => (
                            <li key={idx}>{nameMap[voter] || voter}</li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

    const removePoll = async () => {
        try {
            await deletePoll(pollID, clanData.id);

            alert("Poll has been deleted");
        }
        catch (error) {
            console.log("Could not delete Poll ", error);
        }
    }

    const disablePoll = async () => {
        try {
            await closePoll(clanData.id, pollID);
        }
        catch (error) {
            console.log("Cannot close the Poll ", error);
        }
    }

    const isPollDisabledByDate = async () => {
        if (!poll.closedDate || !poll.isOpen) return;

        const now = new Date();
        const closeDate = new Date(poll.closedDate);

        if (now >= closeDate) {
            await closePoll(clanData.id, pollID); 
        }
    }

    return (
        <>
            <div style={{ width: "100%", height: "300px" }}>
                {totalVotes === 0 && <p>No votes yet, be the first to vote!</p>}
                {!poll.isOpen && <p className="text-gray-500 italic">This poll is closed. You can no longer vote.</p>}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={voteCounts}>
                        <CartesianGrid strokeDasharray= "3 3" />
                        <XAxis dataKey="option"/>
                        <YAxis allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />}/>
                        <Bar dataKey="votes" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <button onClick={removePoll}> Delete Poll </button>
            <button onClick={disablePoll}> Close Poll </button>
        </>
    )
}

export default PollResults;