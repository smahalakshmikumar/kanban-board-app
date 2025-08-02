"use client";

import { useEffect } from "react";
import { Task } from "../types/index";
import { useTaskForm } from "../hooks/useTaskForm";
import { useComments } from "../hooks/useComments";
import { TaskFormFields } from "./TaskFormFields";
import { CommentSection } from "./CommentSection";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  taskToEdit?: Task;
};

export default function AddTaskModal({
  isOpen,
  onClose,
  columnId,
  taskToEdit,
}: Props) {
  // Initialize comments from task if editing
  const initialComments = taskToEdit?.comments || [];
  const commentHooks = useComments(initialComments);

  const taskForm = useTaskForm({
    isOpen,
    columnId,
    taskToEdit,
    onClose,
    comments: commentHooks.comments, // Pass comments to task form
  });

  // Reset comments when modal opens with different task
  useEffect(() => {
    if (isOpen) {
      const commentsToSet = taskToEdit?.comments || [];
      commentHooks.setComments(commentsToSet);
    }
  }, [isOpen, taskToEdit?.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          {taskToEdit ? "Edit Task" : "Add Task"}
        </h2>

        <TaskFormFields
          title={taskForm.title}
          setTitle={taskForm.setTitle}
          description={taskForm.description}
          setDescription={taskForm.setDescription}
          titleError={taskForm.titleError}
          descriptionError={taskForm.descriptionError}
          validateTitle={taskForm.validateTitle}
          validateDescription={taskForm.validateDescription}
        />

        <CommentSection
          comments={commentHooks.comments}
          newComment={commentHooks.newComment}
          setNewComment={commentHooks.setNewComment}
          commentError={commentHooks.commentError}
          handleAddComment={commentHooks.handleAddComment}
          handleDeleteComment={commentHooks.handleDeleteComment}
          handleEditComment={commentHooks.handleEditComment}
          handleAddReply={commentHooks.handleAddReply}
          handleEditReply={commentHooks.handleEditReply}
          handleDeleteReply={commentHooks.handleDeleteReply}
          validateNewComment={commentHooks.validateNewComment}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={taskForm.handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            disabled={!taskForm.isValid}
          >
            {taskToEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
