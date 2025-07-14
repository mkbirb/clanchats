// Displays the List of Polls

import { useEffect, useState } from "react";
import { createPoll, retrievePolls } from "./firebaseConfig";
import PollVoting from "./PollVoting";
import PollResults from "./PollResults";
import { useCurrentUser } from "../context/CurrentUserContext";
import Modal from 'react-modal';

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


    return (
        <>
            <div>
                <p> Polls </p>
                <button onClick={() => setDisplayCreatePoll(true)}> Create Poll </button>
                {clanPollList.length > 0 ? (clanPollList.map((poll) => (
                    <>
                        <PollVoting poll={poll} userID={userID} clanData={clanData} />
                        <PollResults pollID={poll.id} clanData={clanData}/>
                    </>
                ))) : (
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
            </div>
        </>
    )
}

export default PollList;