// For creating the Clan Timetable
import { useEffect, useState } from "react";
import { createTimetable } from "./firebaseConfig";

const CreateTimetable = ({clanID}) => {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [bringItems, setBringItems] = useState([""]);
    const [price, setPrice] = useState();
    const [additionalNotes, setAdditionalNotes] = useState("");

    const handleCreateTimetableSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTimetable(clanID, title, date, startTime, endTime, price, bringItems, additionalNotes);
        }
        catch (error) {
            console.log("Unable to Create Timetable ", error);
        }
    }

    // Updates the Item List if they have been changed
    const handleItemsChange = (index, value) => {
        const newItems = [...bringItems]
        newItems[index] = value;
        setBringItems(newItems);
    }

    const addItem = () => {
        setBringItems([...bringItems, ""]);
    }

    const removeItem = (index) => {
        setBringItems(bringItems.filter((_, i) => i !== index));
    }

    return (
        <>
            <p> Create Timetable </p>
            <form onSubmit={handleCreateTimetableSubmit}>
                <input type="text" placeholder="Event Title" onChange={(e) =>setTitle(e.target.value)}/>
                <label htmlFor="date"> Date </label>
                <input id="date" type="date" onChange={(e) =>setDate(e.target.value)}/>
                <label htmlFor="startTime"> Start Time </label>
                <input id="startTime" type="time" onChange={(e) =>setStartTime(e.target.value)}/>
                <label htmlFor="endTime"> End Time </label>
                <input id="endTime" type="time" onChange={(e) =>setEndTime(e.target.value)}/>
                <input type="text" placeholder="Price" onChange={(e) =>setPrice(e.target.value)}/>
                {bringItems.map((item, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            placeholder={`Item ${index + 1}`}
                            value={item} 
                            onChange={(e) => handleItemsChange(index, e.target.value)}/>
                        <button type="button" onClick={() => removeItem(index)}> Remove </button>
                    </div>
                ))}
                <button type="button" onClick={addItem}> Add more Items </button>
                <input type="text" placeholder="Additional Notes" onChange={(e) =>setAdditionalNotes(e.target.value)}/>
                <input type="submit" />
            </form>
        </>
    )
}

export default CreateTimetable;