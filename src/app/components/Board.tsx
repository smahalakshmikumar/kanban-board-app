"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTaskModal from "./AddTaskModal";
import { RootState } from "../store";
import {
    addColumn,
    deleteColumn,
    deleteTask,
    moveTask,
    renameColumn,
    Task,
} from "../features/board/boardSlice";
import { v4 as uuidv4 } from "uuid";
import { FiEdit2, FiTrash } from "react-icons/fi";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

export default function Board() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState("");
    const [newColumnName, setNewColumnName] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task>();

    const board = useSelector((state: RootState) => state.board);

    const handleAddColumn = () => {
        const id = uuidv4();
        if (newColumnName.trim()) {
            dispatch(addColumn({ id, name: newColumnName }));
            setNewColumnName("");
        }
    };

    const handleDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )
            return;

        dispatch(
            moveTask({
                fromColumnId: source.droppableId,
                toColumnId: destination.droppableId,
                fromIndex: source.index,
                toIndex: destination.index,
            })
        );
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4">
            <div className="text-2xl font-semibold mb-4">Kanban Board</div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-4 overflow-x-auto">
                    {Object.values(board.columns).map((column) => (
                        <div
                            key={column.id}
                            className="w-72 flex-shrink-0 bg-neutral-900 p-4 rounded-xl shadow border border-neutral-800"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <input
                                    className="bg-transparent border-b w-full text-lg font-bold outline-none"
                                    value={column.name}
                                    onChange={(e) =>
                                        dispatch(
                                            renameColumn({
                                                id: column.id,
                                                newName: e.target.value,
                                            })
                                        )
                                    }
                                />
                                <button
                                    className="text-red-400 ml-2 text-sm"
                                    onClick={() => dispatch(deleteColumn(column.id))}
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
                                            <Draggable
                                                key={task.id}
                                                draggableId={task.id}
                                                index={index}
                                            >
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
                                                                    onClick={() => {
                                                                        setSelectedColumnId(column.id);
                                                                        setIsModalOpen(true);
                                                                        setSelectedTask(task);
                                                                    }}
                                                                    className="text-gray-400 hover:text-white"
                                                                >
                                                                    <FiEdit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            deleteTask({
                                                                                columnId: column.id,
                                                                                taskId: task.id,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <FiTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-neutral-400">
                                                            {task.description}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}

                                        <button
                                            className="w-full mt-2 text-sm text-blue-400 hover:underline"
                                            onClick={() => {
                                                setSelectedColumnId(column.id);
                                                setIsModalOpen(true);
                                                setSelectedTask(undefined);
                                            }}
                                        >
                                            + Add Task
                                        </button>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}

                    {/* Add new column */}
                    <div className="w-72 flex-shrink-0 bg-neutral-900 p-4 rounded-xl shadow border border-neutral-800">
                        <input
                            placeholder="New Column Name"
                            className="w-full p-2 bg-neutral-800 text-white rounded mb-2"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                        />
                        <button
                            onClick={handleAddColumn}
                            className="w-full text-sm text-green-400 hover:underline"
                        >
                            + Add Column
                        </button>
                    </div>
                </div>
            </DragDropContext>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                columnId={selectedColumnId}
                taskToEdit={selectedTask}
            />
        </div>
    );
}
