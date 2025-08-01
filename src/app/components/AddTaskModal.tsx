'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTask, editTask } from "../features/board/boardSlice";
import { NestedCommentItem } from "./CommentItem";
import { UserComment, Task } from '../types/index';

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
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newComment, setNewComment] = useState("");

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
    }
  }, [isOpen, taskToEdit]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: UserComment = {
      id: uuidv4(),
      text: newComment.trim(),
      replies: [],
    };

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEditComment = (commentId: string, newText: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, text: newText } : c
      )
    );
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    const reply: UserComment = {
      id: uuidv4(),
      text: replyText,
      replies: [],
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            replies: [...(comment.replies || []), reply],
          }
          : comment
      )
    );
  };

  const handleEditReply = (commentId: string, replyId: string, newText: string) => {
    const updateReplies = (comments: UserComment[]): UserComment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.map((reply) =>
              reply.id === replyId ? { ...reply, text: newText } : reply
            ),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateReplies(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments((prev) => updateReplies(prev));
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    const removeReply = (comments: UserComment[]): UserComment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.filter((reply) => reply.id !== replyId),
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: removeReply(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments((prev) => removeReply(prev));
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
      dispatch(editTask({
        columnId, task: taskToEdit, updatedTask: {
          title: newTask.title,
          description: newTask.description,
          comments: newTask.comments,
        },
      }));
    } else {
      dispatch(addTask({ columnId, task: newTask }));
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-900 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">
          {taskToEdit ? "Edit Task" : "Add Task"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-3 rounded mb-4 bg-neutral-800 text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 rounded mb-4 bg-neutral-800 text-white resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="mb-4">
          <label className="block mb-3 text-white font-semibold text-lg">
            Comments ({comments.length})
          </label>

          {/* Add New UserComment */}
          <div className="mb-4">
            <textarea
              placeholder="Add a comment..."
              className="w-full p-3 rounded bg-neutral-800 text-white resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              rows={2}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-neutral-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-1">
                {comments.map((comment) => (
                  <NestedCommentItem
                    key={comment.id}
                    comment={comment}
                    onDelete={() => handleDeleteComment(comment.id)}
                    onEdit={(newText) => handleEditComment(comment.id, newText)}
                    onAddReply={(replyText) => handleAddReply(comment.id, replyText)}
                    onEditReply={(replyId, newText) =>
                      handleEditReply(comment.id, replyId, newText)
                    }
                    onDeleteReply={(replyId) =>
                      handleDeleteReply(comment.id, replyId)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
            disabled={!title.trim()}
          >
            {taskToEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}