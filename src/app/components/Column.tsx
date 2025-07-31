import { memo } from "react";
import { Task } from "../features/board/boardSlice";
import { Droppable } from "@hello-pangea/dnd";
import { TaskCard } from "./TaskCard";

export const Column = memo(
  ({
    column,
    onRename,
    onDelete,
    onAddTask,
    onEditTask,
    onDeleteTask,
  }: {
    column: { id: string; name: string; tasks: Task[] };
    onRename: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onAddTask: (columnId: string) => void;
    onEditTask: (columnId: string, task: Task) => void;
    onDeleteTask: (columnId: string, taskId: string) => void;
  }) => (
    <div className="min-w-[14rem] max-w-xs flex-shrink-0 bg-neutral-900 p-4 rounded-xl shadow border border-neutral-800 snap-start">
      <div className="flex items-center justify-between mb-4">
        <input
          className="bg-transparent border-b w-full font-bold outline-none text-base sm:text-lg"
          value={column.name}
          onChange={(e) => onRename(column.id, e.target.value)}
        />
        <button
          className="text-red-400 ml-2 text-sm"
          onClick={() =>
            window.confirm("Are you sure to delete column?") && onDelete(column.id)
          }
        >
          ✕
        </button>
      </div>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4 min-h-[40px]"
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
            <button
              className="w-full mt-2 text-sm text-blue-400 hover:underline"
              onClick={() => onAddTask(column.id)}
            >
              + Add Task
            </button>
          </div>
        )}
      </Droppable>
    </div>
  )
);
