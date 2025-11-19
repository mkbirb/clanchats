// Displays the Poll that allows the User to vote

import { useEffect, useState } from "react";
import { getUserByID, voteOnPoll } from "./firebaseConfig";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getTimeFromFirestoreTimestamp } from "../utils/getTimeFromFirestoreTimestamp";
import useCountdown from "../customHooks/useCountdown";

const PollVoting = ({poll, userID, clanData}) => {
    const [selected, setSelected] = useState([]);
    const multiple = poll.allowMultipleVotes;
    const [createdByName, setCreatedByName] =  useState("");

    useEffect(() => {
        const loadUser = async () => {
            const user = await getUserByID(poll.createdBy);
            setCreatedByName(user.name);
        }

        loadUser();
    }, [poll.createdBy])

    const toggleOption = (option) => {
        if (multiple) {
            // If option is alreaduy selected and is clicked again, it is removed from the selected list
            setSelected((prev) => prev.includes(option) ? prev.filter((o) => o !== option): [...prev, option]);
        }
        else {
            // For polls that only accept single options
            setSelected([option]);
        }

    }

    const submitVote = async (e) => {
        e.preventDefault();
        try {
            await voteOnPoll(clanData.id, poll.id, userID, selected);
        }
        catch (error) {
            console.log("Could not submit vote for Poll ", error);
        }
    }

    // Countdown to the closing time of the poll
    const countdown = useCountdown(poll.closedDate);

    return (
        <>
            <div className="flex flex-col flex-2 items-center">
                <p className="text-center font-bold text-2xl !mb-3"> {poll.question} </p>
                <p className="italic !text-lg"> Created at: <b>{getFormattedDate(poll.createdAt)} {getTimeFromFirestoreTimestamp(poll.createdAt)}</b> </p>
                <p className="text-lg"> Created By: <b>{createdByName}</b></p>
                <p className="!mb-3"> Closing at: <b> {countdown} </b> </p>
                <form onSubmit={submitVote}>
                    {poll.options.map((option) => (
                        <>
                            <div key={option} className="!mb-2">
                                <input
                                    type={multiple ? "checkbox": "radio"}
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                />
                                <label className="!text-xl"> {option} </label>
                            </div>
                        </>
                    ))}
                    <button 
                        type="submit"
                        className={`!px-4 !py-2 !rounded !text-white !font-bold !transition !mt-3
                            ${poll.isOpen ? "!bg-green-500 !hover:bg-green-600 cursor-pointer" : "!bg-gray-400 !cursor-not-allowed"}`}
                        disabled={!poll.isOpen}> Submit Vote </button>
                </form>
            </div>
        </>
    )
}

export default PollVoting;