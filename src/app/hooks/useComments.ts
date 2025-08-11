import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserComment } from "../types/index";
import {
  validateComment,
  sanitizeInput,
  validateItems,
} from "../utils/validation";

export function useComments(initialComments: UserComment[] = []) {
  const [comments, setComments] = useState<UserComment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  const handleAddComment = () => {
    const validation = validateComment(newComment);
    if (!validation.isValid) {
      setCommentError(validation.errors[0]);
      return;
    }
    setCommentError(null);

    const comment: UserComment = {
      id: uuidv4(),
      text: sanitizeInput(newComment.trim()),
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
        c.id === commentId ? { ...c, text: sanitizeInput(newText) } : c
      )
    );
  };

  const handleAddReply = (commentId: string, replyText: string) => {
    const reply: UserComment = {
      id: uuidv4(),
      text: sanitizeInput(replyText),
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

  const handleEditReply = (
    commentId: string,
    replyId: string,
    newText: string
  ) => {
    const editInTree = (comments: UserComment[]): UserComment[] =>
      comments.map((comment) => {
        // Case 1: Direct match - update reply in this comment
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies?.map((reply) =>
              reply.id === replyId
                ? { ...reply, text: sanitizeInput(newText) }
                : reply
            ),
          };
        }

        // Case 2: Check nested replies (recursively)
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: editInTree(comment.replies),
          };
        }

        // Case 3: No changes
        return comment;
      });

    setComments((prev) => editInTree(prev));
  };

  const handleDeleteReply = (commentId: string, replyId: string) => {
    const removeReply = (comments: UserComment[]): UserComment[] =>
      comments.map((comment) => ({
        ...comment,
        replies:
          comment.id === commentId
            ? // if this is the comment we are looking for,remove
              comment.replies?.filter((r) => r.id !== replyId)
            : // else, if there are nested replies, process them recursively
            comment.replies
            ? removeReply(comment.replies)
            : undefined,
      }));

    setComments((prev) => removeReply(prev));
  };

  const validateNewComment = (value: string) => {
    return validateItems(value, validateComment, setCommentError);
  };

  return {
    comments,
    setComments,
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
  };
}
