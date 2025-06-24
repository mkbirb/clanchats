// For the Task in a Clan Timetable
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTask = ({ task, slotsTaken }) => {
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
        <p>{task.title || "Unnamed Task"}</p>
        <p>{task.duration}</p>
      </div>
    </div>
  );
};

export default SortableTask;
