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
} from "../features/board/boardSlice";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import AddTaskModal from "./AddTaskModal";
import { Column } from "./Column";
import { Task } from "../types";
import { validateColumnName, sanitizeInput } from "../utils/validation"; // adjust path if needed

export default function Board() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [columnNameError, setColumnNameError] = useState<string | null>(null); // validation error state
  const [selectedTask, setSelectedTask] = useState<Task>();
  const board = useSelector((state: RootState) => state.board);

  // Validate new column name on input change
  const handleNewColumnNameChange = (value: string) => {
    setNewColumnName(value);
    const validation = validateColumnName(value);
    setColumnNameError(validation.errors[0] || null);
  };

  const handleAddColumn = useCallback(() => {
    const validation = validateColumnName(newColumnName);
    setColumnNameError(validation.errors[0] || null);

    if (!validation.isValid) return;

    dispatch(addColumn({ id: uuidv4(), name: sanitizeInput(newColumnName.trim()) }));
    setNewColumnName("");
    setColumnNameError(null);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
              onChange={(e) => handleNewColumnNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
              className={`w-full p-2 bg-neutral-800 text-white rounded mb-1 text-base ${
                columnNameError ? "border border-red-500" : ""
              }`}
            />
            {columnNameError && (
              <p className="text-red-500 mb-2 text-sm">{columnNameError}</p>
            )}
            <button
              onClick={handleAddColumn}
              disabled={!newColumnName.trim() || !!columnNameError}
              className="w-full text-sm text-green-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
