import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserComment } from "../types/index";
import { validateComment, sanitizeInput } from "../utils/validation";

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
        const updateReplies = (comments: UserComment[]): UserComment[] => {
            return comments.map((comment) => {
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

    const validateNewComment = (value: string) => {
        const validation = validateComment(value);
        setCommentError(validation.errors[0] || null);
        return validation.isValid;
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
