// Displays the List of Polls

import { useEffect, useState } from "react";
import { createPoll, retrievePolls } from "./firebaseConfig";
import PollVoting from "./PollVoting";
import PollResults from "./PollResults";
import { useCurrentUser } from "../context/CurrentUserContext";
import Modal from 'react-modal';
import Image from "next/image";
import pollsIcon from '../images/birdVote.png';

const PollList = ({clanData}) => {

    const { userID } = useCurrentUser(); 

    const [clanPollList, setClanPollList] = useState([]); 
    const [displayCreatePoll, setDisplayCreatePoll] = useState(false);

    // Poll Fields
    const [question, setQuestion] = useState();
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [options, setOptions] = useState([""]);
    const [closedDate, setClosedDate] = useState();
    
    // Error warnings
    const [dateError, setDateError] = useState("");

    useEffect(() => {
        if (!clanData?.id) return;           

        
        const unsubscribe = retrievePolls(clanData.id, (polls) => {
            setClanPollList(polls);
        });

        
        return () => unsubscribe();
    }, [clanData.id]);

    const resetCreatePollModal = () => {
        setDisplayCreatePoll(false);

        setQuestion("");
        setAllowMultiple(false);
        setOptions([]);
    }

    const addMoreOptions = (e) => {
        e.preventDefault();
        setOptions([...options, ""]);
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    }

    const handlePollCreationSubmit = async (e) => {
        e.preventDefault();

        setDisplayCreatePoll(false);

        try {
            await createPoll(question, options, allowMultiple, closedDate, userID, clanData.id);
        }
        catch (error) {
            console.log("Could NOT submit the new Poll being created!", error);
        }
    }

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;

        // Get Todays Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateObj = new Date(selectedDate);
        selectedDateObj.setHours(0, 0, 0, 0);

        // Checks if the Selected Date is in the Past or not
        if (selectedDateObj <= today) {
            setDateError('Closed date must be in the future.');
        }
        else {
            setDateError('');
            setClosedDate(selectedDate);
        }
    }

    // Sort the Polls based on New Open Polls First, then Closed Later Polls etc
    const sortedPolls = [...clanPollList].sort((a, b) => {
        // Open poll first
        if (a.isOpen !== b.isOpen) {
            return a.isOpen ? -1 : 1; 
        }

        // Since the input is Firestore Stamp
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);

        // Sort by created date if both are open or both are closed
        return bDate - aDate; 
    })


    return (
        <>
            <div className="flex flex-2 !mt-2">
                <div className="flex flex-2 h-[10vh] gap-3">
                    <Image
                        src={pollsIcon} 
                        className="h-[1%] w-[12%]"/>
                    <div>
                        <p className="font-bold text-2xl !mt-7 !mb-2"> Polls </p>
                        <hr className="!bg-[#f79326] !h-3 rounded-2xl !border-0 w-[100%]" />
                    </div>
                </div>
                <button onClick={() => setDisplayCreatePoll(true)} className="!bg-black !text-white self-center !font-bold border !rounded-2xl w-30 h-10 cursor-pointer"> Create Poll </button>
            </div>
                {clanPollList.length > 0 ? (
                    <div className="max-h-[800px] overflow-y-auto">
                        {sortedPolls.map((poll) => (
                            <>
                                <div className="flex flex-2">
                                    <PollResults pollID={poll.id} clanData={clanData}/>
                                    <PollVoting poll={poll} userID={userID} clanData={clanData} />
                                </div>
                            </>
                        ))}
                    </div>) : (
                    <p> No Clan Votes yet...</p>
                )}
                <Modal isOpen={displayCreatePoll} onRequestClose = {resetCreatePollModal}>
                    <p> Create Poll </p>
                    <form onSubmit={handlePollCreationSubmit}>
                        <label htmlFor="pollQuestion"> Poll Question </label>
                        <input id="pollQuestion" type="text" placeholder="Enter Question" onChange={(e) => setQuestion(e.target.value)} required/>
                        <label> Allow Multiple Options </label>
                        <input type="checkbox" onChange={(e) => setAllowMultiple(e.target.value)}/>
                        <label> Close Date </label>
                        <input type="date" onChange={handleDateChange} required/>
                        {dateError && (
                            <p> {dateError} </p>
                        )}
                        <label> Options </label>
                        {options.map((option, index) => (
                            <input 
                                type="text" 
                                value={option} 
                                onChange={(e) => handleOptionChange(index, e.target.value)} 
                                placeholder={`Option ${index + 1}`}
                                key={`Option ${index + 1}`} />
                        ))}
                        <button type="button" onClick={(e) => addMoreOptions(e)}> Add More Options </button>
                        <button type="submit"> Submit </button>
                    </form>
                </Modal>
        </>
    )
}

export default PollList;