// Displays the list of Reusable Tasks created for the Clan for the Clan Timetable

import { useEffect, useState } from "react";
import { deleteTimetableTask, retrieveAllTimetableTasks } from "./firebaseConfig";
import { 
  DndContext, 
  closestCenter, 
  MouseSensor,
  TouchSensor,
  useSensor, 
  useSensors,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";

const ReusableTaskList = ({clanID, taskListDivid}) => {
    const [reusableTasks, setReusableTasks] = useState([]);

    const { setNodeRef, isOver } = useDroppable({
        id: taskListDivid,
    });


    const fetchReusableTasks = async () => {
        try {
            const fetchedTasks = await retrieveAllTimetableTasks(clanID);
            
            setReusableTasks(fetchedTasks);
        }
        catch (error) {
            console.log("Cannot fetch Reusable Tasks ", error);
        }
    }

    useEffect(() => {
        fetchReusableTasks();
    }, [])

    const handleDelete = async (taskID) => {
        try {
            await deleteTimetableTask(clanID, taskID);

            // Refresh after deletion
            fetchReusableTasks();
        }
        catch (error) {
            console.log("Cannot delete the Reusable Task ", error);
        }
    }

    // Used to identify what can Drag the Tasks
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor)
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = reusableTasks.findIndex((task) => task.id === active.id);
            const newIndex = reusableTasks.findIndex((task) => task.id === over.id);

            setReusableTasks((prev) => arrayMove(prev, oldIndex, newIndex));
        }
    };

    const DraggableTask = ({ task }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            // ID tracks which item is being dragged
            id: task.id,
            // Extra data that is used to help you identify what kind of item is being dragged
            data: { 
                type: "reusable-task",
                task: task 
            }, 
        });

        const style = {
            transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
            border: "1px solid gray", padding: "8px", marginBottom: "4px",
        };

        return (
            <li ref={setNodeRef} {...listeners} {...attributes} style={style}>
                {task.title || 'Unnamed Task'}
                {task.duration}
            </li>
        );
    };

    return (
        <>
            <div id={taskListDivid} ref={setNodeRef}>
                <p> Reusable Task List</p>
                {reusableTasks.length === 0 ?
                    <p> Theres no Reusable Tasks yet </p> :
                    <ul>
                        {reusableTasks.map(task => <DraggableTask key={task.id} task={task} />)}
                    </ul>
                }
            </div>
        </>
    )
}

export default ReusableTaskList;