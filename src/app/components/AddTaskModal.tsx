'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTask, Task, editTask } from "../features/board/boardSlice";
import { FiEdit2, FiTrash } from "react-icons/fi";

type Comment = {
  id: string;
  text: string;
};

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
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setComments(taskToEdit.comments || []);
      } else {
        setTitle("");
        setDescription("");
        setComments([]);
      }
      setNewComment("");
      setEditingCommentId(null);
      setEditingCommentText("");
    }
  }, [isOpen, taskToEdit]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { id: uuidv4(), text: newComment.trim() }]);
    setNewComment("");
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEditComment = (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (comment) {
      setEditingCommentId(id);
      setEditingCommentText(comment.text);
    }
  };

  const handleSaveEditedComment = () => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === editingCommentId ? { ...c, text: editingCommentText } : c
      )
    );
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const handleAdd = () => {
    if (!title.trim()) return;

    const newTask: Task = {
      id: taskToEdit?.id || uuidv4(),
      title,
      description,
      comments,
    };

    if (taskToEdit) {
      dispatch(editTask({ columnId, task: taskToEdit, updatedTask: newTask }));
    } else {
      dispatch(addTask({ columnId, task: newTask }));
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          {taskToEdit ? "Edit Task" : "Add Task"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded mb-3 bg-neutral-800 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-2 rounded mb-3 bg-neutral-800 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="mb-3">
          <label className="block mb-1 text-white font-semibold">Comments</label>

          <div className="space-y-2 mb-2 max-h-40 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-neutral-800 p-2 rounded flex flex-wrap justify-between items-start gap-2 break-words"
              >
                <div className="flex-1 min-w-0">
                  {editingCommentId === comment.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="w-full p-1 rounded bg-neutral-700 text-white"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditedComment();
                          if (e.key === "Escape") {
                            setEditingCommentId(null);
                            setEditingCommentText("");
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-white whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>
                  )}
                </div>

                <div className="flex gap-1 text-sm mt-1">
                  {editingCommentId === comment.id ? (
                    <>
                      <button
                        onClick={handleSaveEditedComment}
                        className="text-green-400 hover:text-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentText("");
                        }}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditComment(comment.id)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FiTrash size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1 p-2 rounded bg-neutral-800 text-white"
            />
            <button
              onClick={handleAddComment}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            {taskToEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
