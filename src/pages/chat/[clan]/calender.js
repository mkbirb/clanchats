import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ToClanHome from "../../../components/ToClanHome";
import { createClanCalenderEvent, deleteClanCalenderEvent, getClanCalenderEvents, updateClanCalenderEvent } from "../../../components/firebaseConfig";
import Modal from "react-modal";
import { useRouter } from "next/router";

const calender = () => {
    const [events, setEvents] = useState([]);
    const [displayEventModal, setDisplayEventModal] = useState(false);
    const [eventData, setEventData] = useState({title: "", startDate: "", endDate: "", description: "", type: ""});
    const [currentEvent, setCurrentEvent] = useState(null);
    const [refreshCalender, setRefreshCalender] = useState(false);

    
    const router = useRouter();
    const { clan } = router.query;

    useEffect(() => {
        const fetchEvents = async () => {
            const clanEvents = await getClanCalenderEvents(clan);
            setEvents(clanEvents);
        }

        fetchEvents();
    }, [clan, refreshCalender]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentEvent) {
            // Update the Event

            try {
                await updateClanCalenderEvent(clan, currentEvent.id, eventData.title, eventData.startDate, eventData.endDate, eventData.description, eventData.type);
            }
            catch (error) {
                console.log("Cannot update the Clan Event ", error);
            }
        }
        else {
            // Add the Event
            try {
                await createClanCalenderEvent(clan, eventData.title, eventData.startDate, eventData.endDate, eventData.description, eventData.type);
            }
            catch(error) {
                console.log("Cannot create a Clan Calender Event ", error);
            }
        }

        setDisplayEventModal(false);
        setRefreshCalender((prev) => !prev);
    }

    // When a spot in the Calender is selected
    const handleDateClick = (arg) => {
        setEventData({title: "", startDate: arg.dateStr, endDate: arg.dateStr, description: "", type: ""});
        setDisplayEventModal(true);
        // As just the Date in the calender, then
        setCurrentEvent(null);
    }

    const handleEventClick = ({event}) => {
        setEventData({ title: event.title, startDate: event.startStr, endDate: event.startStr, description: event.extendedProps.description || "" , type: event.extendedProps.type || ""});
        setDisplayEventModal(true);
        setCurrentEvent(event)
    }

    const handleEventDelete = async () => {
        if (currentEvent) {
            try {
                await deleteClanCalenderEvent(clan, currentEvent.id);
                setDisplayEventModal(false);
                setRefreshCalender((prev) => !prev);
            } 
            catch (error) {
                console.error("Cannot delete the Clan Event", error);
            }
        }
    };

    // For the displaying of the Icons next to the Event Titles
    const renderEventContent = (arg) => {
        const type = arg.event.extendedProps.type || "";

        const icons = {
            birthday: "🎂",
            meetup: "⭐",
            availabilities: "✅",
            unavailabilities: "❌",
            majorMeetup: "🏆",
        };

        const icon = icons[type] || "";

        return (
            <>
                <span style={{ marginRight: 5 }}>{icon}</span>
                <b>{arg.event.title}</b>
            </>
        );
    }

    return (
        <>
            <ToClanHome />
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventDidMount={(info) => {
                    const now = new Date();
                    const endDate = new Date(info.event.end || info.event.start);
                    const type = info.event.extendedProps.type;

                    const backgroundColors = {
                        birthday: "#ff5cec",         
                        unavailabilities: "#ff9c9c",
                        availabilities: "#b6fcb6",   
                        meetup: "#1cb0ff",           
                        majorMeetup: "#1cfff0",      
                    };

                    const bgColor = backgroundColors[type];

                    if (endDate.toDateString() === now.toDateString()) {
                        info.el.style.backgroundColor = "#33cc33"; 
                        info.el.style.borderColor = "#a9a9a9";   
                    }
                    else if (endDate < now) {
                        // Apply gray background style to past events
                        info.el.style.backgroundColor = "#d3d3d3"; 
                        info.el.style.borderColor = "#a9a9a9";    
                    }
                    else {
                        info.el.style.backgroundColor = bgColor;
                    }
                }}
                eventContent={renderEventContent}
            />
            <Modal 
                isOpen={displayEventModal} 
                onRequestClose={(() => setDisplayEventModal(false))}
                style={{
                    overlay: {
                    zIndex: 1000, 
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }
                }}>
                <p> {currentEvent ? "Edit Event" : "Add Event"} </p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Event Title"
                        value={eventData.title || ""}
                        onChange={(e) =>
                            setEventData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                    />
                    <label htmlFor="startDate"> Start Date</label>
                    <input
                        id="startDate"
                        type="date"
                        value={eventData.startDate || ""}
                        readOnly
                    />
                    <label htmlFor="endDate"> End Date</label>
                    <input
                        id="endDate"
                        type="date"
                        value={eventData.endDate || ""}
                        onChange={(e) =>
                            setEventData((prev) => ({ ...prev, endDate: e.target.value }))
                        }
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Event Description"
                        value={eventData.description || ""}
                        onChange={(e) =>
                            setEventData((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />
                    <label htmlFor="type"> Event Type </label>
                    <select id="type" value={eventData.type} onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value }))} required>
                        <option value="" disabled> -------- </option>
                        <option value="availabilities"> Availabilities </option>
                        <option value="unavailabilities"> Unavailabilities </option>
                        <option value="birthday"> Birthday </option>
                        <option value="meetup"> Meetup </option>
                        <option value="majorMeetup"> Major Meetup </option>
                    </select>
                    <button> {currentEvent ? "Update" : "Add"} </button>
                    { currentEvent && (
                        <button
                        type="button"
                        onClick={(e) => {
                            handleEventDelete();
                        }}
                        >
                            Delete
                        </button>
                    )}
                </form>
            </Modal>
        </>
    )
}

export default calender;