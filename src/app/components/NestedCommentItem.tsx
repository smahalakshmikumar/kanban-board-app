import { useState, useEffect } from "react";
import { UserComment } from "../types";

interface NestedCommentItemProps {
  comment: UserComment;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  onAddReply: (replyText: string) => void;
  onEditReply: (replyId: string, newText: string) => void;
  onDeleteReply: (replyId: string) => void;
}

export const NestedCommentItem = ({
  comment,
  onDelete,
  onEdit,
  onAddReply,
  onEditReply,
  onDeleteReply,
}: NestedCommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment.text);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  useEffect(() => {
    setText(comment.text);
  }, [comment.text]);

  const handleSaveEdit = () => {
    if (text.trim() === "") {
      setText(comment.text);
    } else {
      onEdit(text.trim());
    }
    setIsEditing(false);
  };

  const handleAddReply = () => {
    if (replyText.trim()) {
      onAddReply(replyText.trim());
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleReplyEdit = (replyId: string, newText: string) => {
    onEditReply(replyId, newText);
  };

  const handleReplyDelete = (replyId: string) => {
    onDeleteReply(replyId);
  };

  const handleNestedReplyAdd = (parentReplyId: string, replyText: string) => {
    // For nested replies, we'll add them as replies to the specific comment
    onAddReply(replyText);
  };

  return (
    <div className="mb-3">
      {/* Main UserComment */}
      <div className="bg-neutral-800 p-3 rounded-lg border-l-2 border-neutral-600">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full bg-neutral-700 rounded px-3 py-2 text-white resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                } else if (e.key === "Escape") {
                  setText(comment.text);
                  setIsEditing(false);
                }
              }}
              autoFocus
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setText(comment.text);
                  setIsEditing(false);
                }}
                className="px-3 py-1 bg-neutral-600 text-white text-sm rounded hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-white mb-2 whitespace-pre-wrap break-words">
              {comment.text}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </button>
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-green-400 hover:text-green-300"
              >
                Reply
              </button>

              {comment.replies && comment.replies.length > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  {showReplies ? "Hide" : "Show"} {comment.replies.length}{" "}
                  {comment.replies.length === 1 ? "reply" : "replies"}
                </button>
              )}
            </div>
          </>
        )}

        {/* Reply Input */}
        {isReplying && (
          <div className="mt-3 space-y-2">
            <textarea
              className="w-full bg-neutral-700 rounded px-3 py-2 text-white resize-none"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddReply();
                } else if (e.key === "Escape") {
                  setIsReplying(false);
                  setReplyText("");
                }
              }}
              rows={2}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddReply}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
                className="px-3 py-1 bg-neutral-600 text-white text-sm rounded hover:bg-neutral-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <NestedCommentItem
              key={reply.id}
              comment={reply}
              onDelete={() => handleReplyDelete(reply.id)}
              onEdit={(newText) => handleReplyEdit(reply.id, newText)}
              onAddReply={(replyText) =>
                handleNestedReplyAdd(reply.id, replyText)
              }
              onEditReply={onEditReply}
              onDeleteReply={onDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};
