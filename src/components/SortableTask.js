// For the Task in a Clan Timetable
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TimetableTaskModal from "./TimetableTaskModal";
import { useState } from "react";

const SortableTask = ({ task, slotsTaken, removeTask}) => {

  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const openTaskModal = (task) => {
      setSelectedTask(task);
      setIsTaskModalOpen(true);
  };


  const height = 50 * slotsTaken;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "scheduled-task",
      task: task 
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: `${height}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-2 border border-gray-300 mb-1 bg-white ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab bg-amber-400 p-2 h-full">
        <div className="grid grid-cols-2">
          <div>
            <p>{task.title || "Unnamed Task"}</p>
            <p>{task.duration}</p>
          </div>
          <div>
            <button onClick={() => removeTask(task.id)}> Remove </button>
            <button onClick={() => openTaskModal(task)}>View Details</button>
          </div>
        </div>

        <TimetableTaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)} />
      </div>
    </div>
  );
};

export default SortableTask;
