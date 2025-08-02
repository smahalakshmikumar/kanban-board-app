"use client";

import { DragDropContext } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Column } from "./Column";
import { AddColumnForm } from "./AddColumnForm";
import { Task } from "../types";

interface BoardGridProps {
  onDragEnd: (result: any) => void;
  onRenameColumn: (id: string, newName: string) => void;
  onDeleteColumn: (id: string) => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (columnId: string, task: Task) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  //column form props
  newColumnName: string;
  columnNameError: string | null;
  isColumnFormValid: boolean;
  onColumnNameChange: (value: string) => void;
  onAddColumn: () => void;
}

export function BoardGrid({
  onDragEnd,
  onRenameColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  newColumnName,
  columnNameError,
  isColumnFormValid,
  onColumnNameChange,
  onAddColumn,
}: BoardGridProps) {
  const board = useSelector((state: RootState) => state.board);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(board.columns).map((column) => (
          <Column
            key={column.id}
            column={column}
            onRename={onRenameColumn}
            onDelete={onDeleteColumn}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}

        <AddColumnForm
          newColumnName={newColumnName}
          columnNameError={columnNameError}
          isValid={isColumnFormValid}
          onNameChange={onColumnNameChange}
          onSubmit={onAddColumn}
        />
      </div>
    </DragDropContext>
  );
}
