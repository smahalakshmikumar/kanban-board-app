import { useState, useEffect } from "react";
import { Comment } from "../features/board/boardSlice";

export const CommentItem = ({
    comment,
    onDelete,
    onEdit,
}: {
    comment: Comment;
    onDelete: () => void;
    onEdit: (newText: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(comment.text);

    // Sync if comment.text changes from outside (rare, but safe)
    useEffect(() => {
        setText(comment.text);
    }, [comment.text]);

    return (
        <div className="flex justify-between items-center bg-neutral-800 p-2 rounded">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        className="flex-1 bg-neutral-700 rounded px-2 py-1 text-white"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onBlur={() => {
                            if (text.trim() === "") {
                                setText(comment.text); // revert if empty
                            } else {
                                onEdit(text.trim());
                            }
                            setIsEditing(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (text.trim() === "") {
                                    setText(comment.text);
                                } else {
                                    onEdit(text.trim());
                                }
                                setIsEditing(false);
                            } else if (e.key === "Escape") {
                                setText(comment.text);
                                setIsEditing(false);
                            }
                        }}
                        autoFocus
                    />
                    <button
                        onClick={onDelete}
                        className="ml-2 text-red-400 hover:text-red-600 text-sm"
                        aria-label="Delete comment"
                    >
                        Delete
                    </button>
                </>
            ) : (
                <>
                    <span
                        className="text-white flex-1 cursor-pointer select-none"
                        onClick={() => setIsEditing(true)}
                        title="Click to edit comment"
                    >
                        {comment.text}
                    </span>
                    <button
                        onClick={onDelete}
                        className="ml-2 text-red-400 hover:text-red-600 text-sm"
                        aria-label="Delete comment"
                    >
                        Delete
                    </button>
                </>
            )}
        </div>
    );
}
