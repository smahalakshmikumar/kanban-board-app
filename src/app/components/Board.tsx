"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import AddTaskModal from "./AddTaskModal";
import { Column } from "./Column";

export default function Board() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState("");
    const [newColumnName, setNewColumnName] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task>();
    const board = useSelector((state: RootState) => state.board);

    const handleAddColumn = useCallback(() => {
        if (newColumnName.trim()) {
            dispatch(addColumn({ id: uuidv4(), name: newColumnName }));
            setNewColumnName("");
        }
    }, [dispatch, newColumnName]);

    const handleDragEnd = useCallback(
        (result: DropResult) => {
            const { destination, source } = result;
            if (
                !destination ||
                (destination.droppableId === source.droppableId &&
                    destination.index === source.index)
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
        },
        [dispatch]
    );

    const handlers = {
        rename: useCallback(
            (id: string, newName: string) => dispatch(renameColumn({ id, newName })),
            [dispatch]
        ),
        deleteColumn: useCallback(
            (id: string) => dispatch(deleteColumn(id)),
            [dispatch]
        ),
        addTask: useCallback((columnId: string) => {
            setSelectedColumnId(columnId);
            setSelectedTask(undefined);
            setIsModalOpen(true);
        }, []),
        editTask: useCallback((columnId: string, task: Task) => {
            setSelectedColumnId(columnId);
            setSelectedTask(task);
            setIsModalOpen(true);
        }, []),
        deleteTask: useCallback(
            (columnId: string, taskId: string) =>
                dispatch(deleteTask({ columnId, taskId })),
            [dispatch]
        ),
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4">
            <div className="text-2xl font-semibold mb-4">Kanban Board</div>
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Stack vertically on small, horizontally scroll on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.values(board.columns).map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            onRename={handlers.rename}
                            onDelete={handlers.deleteColumn}
                            onAddTask={handlers.addTask}
                            onEditTask={handlers.editTask}
                            onDeleteTask={handlers.deleteTask}
                        />
                    ))}

                    <div className="min-w-[14rem] max-w-xs flex-shrink-0 bg-neutral-900 p-4 rounded-xl shadow border border-neutral-800 mt-4 sm:mt-0 snap-start">
                        <input
                            placeholder="New Column Name"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                            className="w-full p-2 bg-neutral-800 text-white rounded mb-2 text-base"
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
