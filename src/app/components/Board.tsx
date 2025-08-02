"use client";

import { useBoardActions } from "../hooks/useBoardActions";
import { useTaskModal } from "../hooks/useTaskModal";
import { useColumnForm } from "../hooks/useColumnForm";
import { BoardGrid } from "./BoardGrid";
import AddTaskModal from "./AddTaskModal";

export default function Board() {
  const boardActions = useBoardActions();
  const taskModal = useTaskModal();
  const columnForm = useColumnForm();

  const handleAddColumn = () => {
    const columnName = columnForm.validateAndReset();
    if (columnName) {
      boardActions.addNewColumn(columnName);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4">
      <div className="text-2xl font-semibold mb-4">Kanban Board</div>

      <BoardGrid
        onDragEnd={boardActions.handleDragEnd}
        onRenameColumn={boardActions.renameExistingColumn}
        onDeleteColumn={boardActions.removeColumn}
        onAddTask={taskModal.openAddTaskModal}
        onEditTask={taskModal.openEditTaskModal}
        onDeleteTask={boardActions.removeTask}
        newColumnName={columnForm.newColumnName}
        columnNameError={columnForm.columnNameError}
        isColumnFormValid={columnForm.isValid}
        onColumnNameChange={columnForm.handleNameChange}
        onAddColumn={handleAddColumn}
      />

      <AddTaskModal
        isOpen={taskModal.isModalOpen}
        onClose={taskModal.closeModal}
        columnId={taskModal.selectedColumnId}
        taskToEdit={taskModal.selectedTask}
      />
    </div>
  );
}
