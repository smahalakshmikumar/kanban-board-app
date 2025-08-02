"use client";

import { UserComment } from "../types/index";
import { NestedCommentItem } from "./NestedCommentItem";

interface CommentSectionProps {
  comments: UserComment[];
  newComment: string;
  setNewComment: (value: string) => void;
  commentError: string | null;
  handleAddComment: () => void;
  handleDeleteComment: (commentId: string) => void;
  handleEditComment: (commentId: string, newText: string) => void;
  handleAddReply: (commentId: string, replyText: string) => void;
  handleEditReply: (
    commentId: string,
    replyId: string,
    newText: string
  ) => void;
  handleDeleteReply: (commentId: string, replyId: string) => void;
  validateNewComment: (value: string) => boolean;
}

export function CommentSection({
  comments,
  newComment,
  setNewComment,
  commentError,
  handleAddComment,
  handleDeleteComment,
  handleEditComment,
  handleAddReply,
  handleEditReply,
  handleDeleteReply,
  validateNewComment,
}: CommentSectionProps) {
  return (
    <div className="mb-4">
      <label className="block mb-3 text-white font-semibold text-lg">
        Comments ({comments.length})
      </label>

      <div className="mb-4">
        <textarea
          placeholder="Add a comment..."
          className={`w-full p-3 rounded bg-neutral-800 text-white resize-none ${
            commentError ? "border border-red-500" : ""
          }`}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
          rows={2}
          onBlur={() => validateNewComment(newComment)}
        />
        {commentError && (
          <p className="text-red-500 mt-1 mb-2 text-sm">{commentError}</p>
        )}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!newComment.trim() || !!commentError}
          >
            Add Comment
          </button>
        </div>
      </div>

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
                onAddReply={(replyText) =>
                  handleAddReply(comment.id, replyText)
                }
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
  );
}
