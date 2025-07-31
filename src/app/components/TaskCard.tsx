import { Draggable } from "@hello-pangea/dnd";
import { memo } from "react";
import { FiEdit2, FiTrash } from "react-icons/fi";
import { Task } from "../features/board/boardSlice";

export const TaskCard = memo(
    ({
        task,
        index,
        columnId,
        onEdit,
        onDelete,
    }: {
        task: Task;
        index: number;
        columnId: string;
        onEdit: (columnId: string, task: Task) => void;
        onDelete: (columnId: string, taskId: string) => void;
    }) => (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-3 bg-neutral-800 rounded-md shadow"
                >
                    <div className="flex items-center justify-between font-medium">
                        <span>{task.title}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit(columnId, task)}
                                className="text-gray-400 hover:text-white"
                            >
                                <FiEdit2 size={16} />
                            </button>
                            <button
                                onClick={() =>
                                    window.confirm("Delete task?") && onDelete(columnId, task.id)
                                }
                                className="text-red-500 hover:text-red-700"
                            >
                                <FiTrash size={16} />
                            </button>
                        </div>
                    </div>
                    {task.description && (
                        <div className="text-sm text-neutral-400 mt-2">{task.description}</div>
                    )}
                </div>
            )}
        </Draggable>
    )
);
