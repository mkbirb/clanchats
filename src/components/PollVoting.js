// Displays the Poll that allows the User to vote

import { useState } from "react";
import { voteOnPoll } from "./firebaseConfig";

const PollVoting = ({poll, userID, clanData}) => {
    const [selected, setSelected] = useState([]);
    const multiple = poll.allowMultipleVotes;

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

    return (
        <>
            <div>
                <p> {poll.question} </p>
                <form onSubmit={submitVote}>
                    {poll.options.map((option) => (
                        <>
                            <div key={option}>
                                <input
                                    type={multiple ? "checkbox": "radio"}
                                    checked={selected.includes(option)}
                                    onChange={() => toggleOption(option)}
                                />
                                <label> {option} </label>
                            </div>
                        </>
                    ))}
                    <button 
                        type="submit"
                        className={`!px-4 !py-2 !rounded !text-white !font-semibold !transition
                            ${poll.isOpen ? "!bg-green-500 !hover:bg-green-600" : "!bg-gray-400 !cursor-not-allowed"}`}
                        disabled={!poll.isOpen}> Submit Vote </button>
                </form>
            </div>
        </>
    )
}

export default PollVoting;