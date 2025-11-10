// For the displaying of the specific Timetable

import React, { useState, useEffect, useMemo } from "react";
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
import { retrieveClanTimetable } from "../../../../components/firebaseConfig";
import { useRouter } from "next/router";
import ReusableTaskList from "../../../../components/ReusableTaskList";
import SortableTask from "../../../../components/SortableTask";
import TimetableShare from "../../../../components/TimetableShare";

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

    const router = useRouter();
    const { clan, timetableID } = router.query;

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

    useEffect(() => {
        fetchTimetable();
    }, [])

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

    const saveReorderedTasks = () => {

    }

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
    const getSlotsCoveredByTask = (task, timeSlots) => {
        const startIndex = timeSlots.indexOf(task.timeSlot);

        if (startIndex === -1 ) return [];

        return timeSlots.slice(startIndex, startIndex + (task.duration || 1));
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

                    // Remove any task that currently occupies the timeslot
                    const withoutConflicts = prev.filter(
                        (t) => {
                            t.id !== draggedTask.id &&
                            !coveredSlots.includes(t.timeSlot)
                        }
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
        ) 
        {
            const timeslotId = over?.id;
            setTasksWithOverrides((prev) => {
                // Remove existing task that already occupies the spot
                const withoutOld = prev.filter((t) => t.timeSlot !== timeslotId);

                console.log("Trying to remove existing task that occupies the spot");

                // Add new task at dropped time slot, from the Reusable Task List for example
                const generateUniqueID = () => "_" + Math.random().toString(36).substr(2, 9);
                const newTask = { ...draggedTask, id: generateUniqueID(), timeSlot: over.id };

                const coveredSlots = getSlotsCoveredByTask(newTask, timeSlots);

                // Stores the new tasks that have been replaced by teh enwly dragged task
                const withoutConflicts = prev.filter(
                    (t) => !coveredSlots.includes(t.timeSlot)
                );

                return [...withoutConflicts, newTask];
            })

        }

        setActiveTaskId(null);
    };

    // Removes the Task, if it has already been added to the Timetable Grid
    const removeTask = (id) => {
        setTasksWithOverrides((prev) => prev.filter((t) => t.id !== id));
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
            <p> Timetable </p>
            <p> {timetable.title} </p>
            <p> From {timetable.startTime} to {timetable.endTime} </p>
            <button onClick={() => openShareModal()}> Share Timetable </button>
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
                {Array.from({ length: 24 }).map((_, hour) => {
                    const base = hour;
                    const subSlots = [`${base}:00`, `${base}:15`, `${base}:30`, `${base}:45`];

                    return (
                        <div key={hour} className="mb-6">
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