
'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";
import { addTask, Task, editTask } from "../features/board/boardSlice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  taskToEdit?: Task;
};

export default function AddTaskModal({ isOpen, onClose, columnId, taskToEdit }: Props) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [comments, setComments] = useState(taskToEdit?.comments || "");

  useEffect(() => {
  if (isOpen) {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setComments(taskToEdit.comments);
    } else {
      // Reset form fields when not editing
      setTitle('');
      setDescription('');
      setComments('');
    }
  }
}, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleAdd = () => {

    if (!title.trim()) return;

    if (taskToEdit) {
      dispatch(
        editTask({
          columnId,
          task: taskToEdit,
          updatedTask: { title, description, comments },

        })
      );
    } else {
      dispatch(
        addTask({
          columnId,
          task: {
            id: uuidv4(),
            title,
            description,
            comments
          },
        })
      );
    }

    setTitle("");
    setDescription("");
    setComments("")
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>

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

        <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Comment" className="w-full p-2 rounded mb-3 bg-neutral-800 text-white" />


        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
