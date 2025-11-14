// For the displaying of the specific Timetable

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  rectIntersection,  
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { editTimetable, getTimetableTasks, retrieveClanTimetable, saveTimetableTasks } from "../../../../components/firebaseConfig";
import { useRouter } from "next/router";
import ReusableTaskList from "../../../../components/ReusableTaskList";
import SortableTask from "../../../../components/SortableTask";
import TimetableShare from "../../../../components/TimetableShare";
import { navigateTo } from "../../../../components/Routes";
import { getMinutesSinceMidnight } from "../../../../utils/getMinutesSinceMidnight";
import useCalculateEndTime from "../../../../customHooks/useCalculateEndTime";

const Timetable = () => {
    const [timetable, setTimetable] = useState(null);
    // The Task that is currently being dragged by the user
    const [activeTaskId, setActiveTaskId] = useState(null);
    // Contains Tasks that have their own Custom Duration or Description unique to Timetable, stemming from Global Tasks
    const [tasksWithOverrides, setTasksWithOverrides] = useState([]);

    const [isDragging, setIsDragging] = useState(false);

    // To help identify the place that the Task is being moved too
    const [activeDroppableId, setActiveDroppableId] = useState(null);


    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [timetableStartMinutes, setTimetableStartMinutes] = useState(null);
    const [timetableEndMinutes, setTimetableEndMinutes] = useState(null);


    // Keeps Track on whether a new task has been added that is placed earlier than the Timetable Start Time
    const [newEarliest, setNewEarliest] = useState(false);
    
    // Keeps track on whether a new task has been added that is placed later than the Timetable End Time
    const [newLatest, setNewLatest] = useState(false);

    const router = useRouter();
    const { clan, timetableID } = router.query;

    const timetableRef = useRef(null);

    const openShareModal = () => {
      setIsShareModalOpen(true);
    };


    const fetchTimetable = async () => {
        try {
            const fetchedTimetable = await retrieveClanTimetable(clan, timetableID);

            setTimetable(fetchedTimetable);
        }
        catch (error) {
            console.log("Cannot fetch the Timetable ", error);
        }
    }

    // Gets the Timetable Tasks from the Database
    const fetchTasks = async () => {
        try {
            const tasks = await getTimetableTasks(timetableID, clan);
            setTasksWithOverrides(tasks);
        }
        catch (error) {
            console.log("Cannot fetch the Timetable Tasks ", error);
        }
    }

    // Warn on Unsaved when Browser Refresh and Tab Close
    useEffect(() => {
        const handleBeforeUnload =  (event) => {
            if (hasUnsavedChanges) {
                event.preventDefault();
                event.returnValue = "";
            }
        };

        // Add Listener
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup the Listener
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);


    // Warn on Unsaved during Internal Navigation
    useEffect(() => {
        const handleRouteChange = (url) => {
            if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Leave anyway?")) {
                router.events.emit("routeChangeError");
                throw "Abort route change. Please ignore this error.";
            }
        };

        // Shows the Window Dialog
        router.events.on("routeChangeStart", handleRouteChange);

        return () => {
            router.events.off("routeChangeStart", handleRouteChange);
        };
        
    }, [hasUnsavedChanges])

    useEffect(() => {
        if (!timetableID) return;

        fetchTimetable();
        fetchTasks();
    }, [timetableID])


    // Get the Starting Times and Ending Times for the Timetable to be used for Highlighting of Correct Area of the Timetable
    useEffect(() => {
        if (!timetable) return;
        
        setTimetableStartMinutes(getMinutesSinceMidnight(timetable.startTime));
        setTimetableEndMinutes(getMinutesSinceMidnight(timetable.endTime)); 
    }, [timetable]);

    const handleSave = async () => {
        if (!timetableID) {
            console.error("Missing Timetable ID");

            return;
        }

        if (tasksWithOverrides.length != 0) {
            const earliestTask = tasksWithOverrides.reduce((earliest, task) => {
                const taskStart = getMinutesSinceMidnight(task.timeSlot);
                if (!earliest || taskStart < getMinutesSinceMidnight(earliest.timeSlot)) {
                    return task;
                }
                return earliest;
            }, null);
            
            if (!earliestTask || !earliestTask.timeSlot) {
                console.error("No valid earliest task found. Skipping update.");
                return; 
            }
            
            const earliestTaskMinutes = getMinutesSinceMidnight(earliestTask.timeSlot);
            const timetableStartMinutes = getMinutesSinceMidnight(timetable.startTime);

            let confirmEarliestChange = "";
            
            if (newEarliest) {

                confirmEarliestChange = window.confirm(`A task starts earlier at ${earliestTask.timeSlot}. Do you want to update the Timetable Start Time?`);
                // console.log("Earliest Task being saved", earliestTask.timeSlot);
            }
            else if (earliestTaskMinutes > timetableStartMinutes) {
                confirmEarliestChange = window.confirm(
                    `The first task starts later at ${earliestTask.timeSlot}. Do you want to update the timetable start time?`
                );
            }

            if (confirmEarliestChange) {    
                // Update the Timetable as well
                setTimetable(prev => ({
                    ...prev,
                    startTime: earliestTask.timeSlot, 
                }));

                await editTimetable(clan, timetable.id, timetable.title, earliestTask.timeSlot, timetable.price, timetable.endTime, timetable.date, timetable.bringItems, timetable.additionalNotes);
            }


            const latestTask = tasksWithOverrides.reduce((latest, task) => {
                const taskEnd = useCalculateEndTime(task.timeSlot, task.duration);
                if (!latest || taskEnd > useCalculateEndTime(latest.timeSlot, latest.duration)) {
                    return { ...task, endTime: taskEnd };
                }
                    return latest;
            }, null);

            const latestTaskMinutes = getMinutesSinceMidnight(latestTask.endTime);
            const timetableEndMinutes = getMinutesSinceMidnight(timetable.endTime);

            // Keeps track of whether the Task End Time has been changed
            let confirmLatestChange = "";

            if (latestTaskMinutes < timetableEndMinutes) {
                confirmLatestChange = window.confirm(
                    `The last task ends earlier at ${latestTask.endTime}. Do you want to update the timetable end time?`
                );
            }
            else if (newLatest) {
                confirmLatestChange = window.confirm(`A task starts later at ${latestTask.endTime}. Do you want to update the Timetable End Time?`);
            }
            
            if (confirmLatestChange) {
                const endTime = useCalculateEndTime(latestTask.timeSlot, latestTask.duration);

                // Update the Timetable as well
                setTimetable(prev => ({
                    ...prev,
                    endTime: endTime,
                }));

                await editTimetable(clan, timetable.id, timetable.title, timetable.startTime, timetable.price, endTime, timetable.date, timetable.bringItems, timetable.additionalNotes);
            }
            
        }

        try {
            await saveTimetableTasks(timetableID, clan, tasksWithOverrides);
            alert("Timetable Saved Successfully");
            setHasUnsavedChanges(false);
            setNewEarliest(false);
            setNewLatest(false);
        }
        catch (error) {
            console.log("Cannot save Timetable Tasks ", error);
            alert("Cannot save Timetable");
        }
    }

    // Autoscroll to the Timetable Start and Timetable End section of the Timetable
    useEffect(() => {
        if (!timetableRef.current) return;

        const firstHourDiv = timetableRef.current.querySelector("div");
        const hourHeight = firstHourDiv.clientHeight;

        // Represents how many pixels each minute of the day represents in the Timetable Grid
        const pixelsPerMinute = hourHeight / 60;

        // Scroll to the Center of the Timetable Start
        const scrollPosition = (timetableStartMinutes * pixelsPerMinute) - 20;

        timetableRef.current.scrollTop = Math.max(0, scrollPosition);


    }, [timetableRef, timetableStartMinutes])

    // Allows for the Time Intervals to be displayed
    const generateTimeSlots = (startHour = 0, endHour = 24, timeInterval = 15) => {
        const slots = [];

        for (let k = startHour; k <= endHour; k++) {
            for (let min = 0; min < 60; min += timeInterval) {
                const formatted = `${k}:${min.toString().padStart(2, '0')}`;
                slots.push(formatted);
            }
        }

        return slots;
    }

    const timeSlots = generateTimeSlots();


    const { grouped: groupedTasks, occupiedSlots } = useMemo(() => {
    const grouped = {};
    const occupiedSlots = new Set();

    timeSlots.forEach((slot, index) => {
        grouped[slot] = [];

        tasksWithOverrides.forEach(task => {
        if (task.timeSlot !== slot) return;
        const startIndex = timeSlots.indexOf(task.timeSlot);
        const durationSlots = Math.ceil(task.duration / 15);

        grouped[slot].push(task);

        for (let i = 1; i < durationSlots; i++) {
            const blockedSlot = timeSlots[startIndex + i];
            if (blockedSlot) {
            occupiedSlots.add(blockedSlot);
            }
        }
        });
    });

    return { grouped, occupiedSlots };
    }, [tasksWithOverrides, timeSlots]);

    // Defines the types of Sensors that would be used for the Draggable Tasks
    // Which is using Mouse Pointer
    const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            // Distance threshold for drag to start
            distance: 1,
        },
    })
    );

    const activeTask = tasksWithOverrides.find(t => t.id === activeTaskId);

    const handleDragStart = (event) => {
        setActiveTaskId(event.active.id);
        setIsDragging(true);
    };

    // Helper function that gets all of the slots that are occupied by a task
    const getSlotsCoveredByTask = (task, timeSlots, slotIntervalMinutes = 15) => {
        const startIndex = timeSlots.indexOf(task.timeSlot);
        if (startIndex === -1) return [];

        // Determine how many slots this task occupies
        const slotCount = Math.ceil(task.duration/ slotIntervalMinutes);

        // Return only the slots within the timetable bounds
        return timeSlots.slice(startIndex, startIndex + slotCount);
    }

    // For the Draggable Elements
    const handleDragEnd = ({ active, over }) => {
        // Stops dragging and checks if element dropped in valid place
        setIsDragging(false);
        if (!over) {
            setActiveTaskId(null);
            return;
        }
        console.log("🧪 over:", over);
        console.log("🧪 over.element:", over.element);


        const draggedTask = active.data.current?.task;
        const dragType = active.data.current?.type;

        if (!draggedTask) {
            setActiveTaskId(null);
            return;
        }
        
        // Checks if there is a new action that has not been saved yet
        setHasUnsavedChanges(true);

        if (dragType === "scheduled-task") {
            
            const timeslotId = over?.id;
            console.log("fun ", timeslotId);

            // If the Task is dropped back into the Reusable Task list after already existing on timetable, then delete
            if (timeslotId === "reusable-task-list") { 
                setTasksWithOverrides((tasks) => 
                    tasks.filter((t) => t.id !== draggedTask.id)
                );
                setActiveTaskId(null);

                return;
            } 

            // Checks if the element is dropped into a valid time slot
            if (typeof timeslotId === "string" && timeSlots.includes(timeslotId)) {
                console.log("wakeup");
                
                setTasksWithOverrides((prev) => {
                    const updatedTask = {...draggedTask, timeSlot: timeslotId};
                    const coveredSlots = getSlotsCoveredByTask(updatedTask, timeSlots);
                    console.log("The Covered Slots of the Task: ", coveredSlots)

                    // Remove any task that currently occupies the timeslot
                    const withoutConflicts = prev.filter(
                        (t) => (
                            t.id !== draggedTask.id &&
                            !coveredSlots.includes(t.timeSlot)
                        )
                    )
                    return [...withoutConflicts, updatedTask]
                })
                
            } 
            else {
                // For the Reordering inside the same slot
                console.log("imdrown");
                const oldIndex = tasksWithOverrides.findIndex(t => t.id === active.id);
                const newIndex = tasksWithOverrides.findIndex(t => t.id === over.id);

                if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                    const updated = arrayMove(tasksWithOverrides, oldIndex, newIndex);
                    setTasksWithOverrides(updated);
                }
            }
        }
        else if (
            dragType === "reusable-task" &&
            typeof over.id === "string" &&
            timeSlots.includes(over.id)
        ) {
            const timeslotId = over.id;

            setTasksWithOverrides(prev => {
                const generateUniqueID = () => "_" + Math.random().toString(36).substr(2, 9);
                const updatedTask = {...draggedTask, timeSlot: timeslotId};
                const coveredSlots = getSlotsCoveredByTask(updatedTask, timeSlots);

                const newTask = {
                    ...draggedTask,
                    id: generateUniqueID(),
                    timeSlot: timeslotId
                };

                // Only remove tasks whose starting slot is exactly the same as new task's start
                const withoutConflicts = prev.filter(t => 
                            t.timeSlot !== newTask.timeSlot &&
                            !coveredSlots.includes(t.timeSlot));

                return [...withoutConflicts, newTask];
            });
        }

        setActiveTaskId(null);
    };

    // Removes the Task, if it has already been added to the Timetable Grid
    const removeTask = (id) => {
        setTasksWithOverrides((prev) => prev.filter((t) => t.id !== id));
        setHasUnsavedChanges(true);
    }


    // The place where the Tasks can be placed in, like the Timeslots
    const DroppableSlot = ({ slot, tasks, isDragging, isActive }) => {
        const { setNodeRef } = useDroppable({ id: slot });

        return (
            <div
                ref={setNodeRef}
                id={slot}
                className={`min-h-[40px] mb-1 p-2 transition-all duration-200
                !border
                ${isDragging ? "opacity-70" : ""}
                ${isActive ? "bg-blue-100 !border-blue-500" : "!border-black"}
                `}
            >
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <ul className="list-none p-0 m-0">
                {tasks.map(task => (
                    task.timeSlot === slot && (
                        <SortableTask
                            key={task.id}
                            task={task}
                            // Longer events take more slots
                            slotsTaken={Math.ceil(task.duration / 15)}
                            removeTask={removeTask}
                        />
                    )
                ))}
                </ul>
            </SortableContext>
            </div>
        );
    };

    // Determine the earliest Timetable Time and the latest Timetable Time
    // Where these times would respect the User Set Timetable Times first, then only expanding if the task falls outside of that range

    tasksWithOverrides.forEach((task) => {
        const taskStart = getMinutesSinceMidnight(task.timeSlot);
        const taskEndRaw = useCalculateEndTime(task.timeSlot, task.duration);
        const taskEnd = getMinutesSinceMidnight(taskEndRaw);

        // Update if the Task is earlier
        if (taskStart < timetableStartMinutes) {
            setTimetableStartMinutes(taskStart);
            setNewEarliest(true);
        }

        // Update if the Task is later
        if (taskEnd > timetableEndMinutes) {
            setTimetableEndMinutes(taskEnd);
            setNewLatest(true);
        }

    });

    // Helps identify which droppable a draggable is currently hovering over
    function customCollisionDetection(args) {
        // Checks if the dragged item intersects with dropabble box.
        const pointerIntersections = rectIntersection(args);
        if (pointerIntersections.length > 0) return pointerIntersections;

        // fallback to closest center or something else
        return closestCenter(args);
    }

    if (!timetable) return <p>Loading timetable...</p>;

    return (
        <>
            <button onClick={() => navigateTo(router, 'CLANTIMETABLES', clan)}> To Timetables</button>
            <p> Timetable </p>
            <p> {timetable.title} </p>
            <p> From {timetable.startTime} to {timetable.endTime} </p>
            <button onClick={() => openShareModal()}> Share Timetable </button>
            <button onClick={handleSave}> Save Timetable </button>
            <TimetableShare
                timetable={timetable}
                timetableTasks={tasksWithOverrides}
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)} />
            <DndContext
                sensors={sensors}
                collisionDetection={customCollisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={({ over }) => {
                    if (over?.id && typeof over.id === "string" && timeSlots.includes(over.id)) {
                        setActiveDroppableId(over.id);
                    } else {
                        setActiveDroppableId(null);
                    }
                }}
                
            >
                <div ref={timetableRef} className="relative h-[600px] overflow-y-auto border border-gray-300">
                    {Array.from({ length: 24 }).map((_, hour) => {
                        const base = hour;
                        const subSlots = [`${base}:00`, `${base}:15`, `${base}:30`, `${base}:45`];

                        return (
                            <div 
                                key={hour} 
                                className="mb-6">
                                <h3 className="font-semibold text-lg mb-2">{`${hour}:00`}</h3>
                                {subSlots.map(slot => {
                                    if (occupiedSlots.has(slot)) {
                                        // Skip this slot, as the Task (That may take 2 slots or more) has overtaken this time slot
                                        return null;
                                    }

                                    return (
                                        <div key={slot} className="flex items-stretch mb-1">
                                        {/* Gap next to the Timeslots for the Time */}
                                        <div
                                            className="w-16 flex-shrink-0 text-right pr-2 select-none text-gray-600"
                                            style={{ height: 40 }}
                                        >
                                        </div>

                                        {/* Timeslot container */}
                                        <div className="w-full">
                                            <SortableContext
                                                items={groupedTasks[slot].map(t => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <DroppableSlot
                                                    slot={slot}
                                                    tasks={groupedTasks[slot]}
                                                    isDragging={isDragging}
                                                    isActive={activeDroppableId === slot}
                                                />
                                            </SortableContext>
                                        </div>
                                        </div>
                                    );
                                })}

                            </div>
                        );
                    })}
                </div>
                <ReusableTaskList clanID={clan} taskListDivid="reusable-task-list"/>
                {/* // Creates visual copy of the task being cloned/dragged */}
                <DragOverlay>
                  {activeTask ? <SortableTask task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>
        </>
    )
}

export default Timetable;