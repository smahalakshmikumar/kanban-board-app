import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addTask, editTask } from "../features/board/boardSlice";
import { Task, UserComment } from "../types/index";
import {
    validateTaskTitle,
    validateTaskDescription,
    sanitizeInput,
} from "../utils/validation";

interface UseTaskFormProps {
    isOpen: boolean;
    columnId: string;
    taskToEdit?: Task;
    onClose: () => void;
    comments: UserComment[]; // Receive comments from outside
}

export function useTaskForm({ isOpen, columnId, taskToEdit, onClose, comments }: UseTaskFormProps) {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Validation error state
    const [titleError, setTitleError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTitle(taskToEdit.title);
                setDescription(taskToEdit.description);
            } else {
                setTitle("");
                setDescription("");
            }
            // Clear errors on open
            setTitleError(null);
            setDescriptionError(null);
        }
    }, [isOpen, taskToEdit]);

    const validateTitle = (value: string) => {
        const validation = validateTaskTitle(value);
        setTitleError(validation.errors[0] || null);
        return validation.isValid;
    };

    const validateDescription = (value: string) => {
        const validation = validateTaskDescription(value);
        setDescriptionError(validation.errors[0] || null);
        return validation.isValid;
    };

    const handleSubmit = () => {
        const isTitleValid = validateTitle(title);
        const isDescriptionValid = validateDescription(description);

        if (!isTitleValid || !isDescriptionValid) {
            return;
        }

        const newTask: Task = {
            id: taskToEdit?.id || uuidv4(),
            title: sanitizeInput(title.trim()),
            description: sanitizeInput(description.trim()),
            comments,
        };

        if (taskToEdit) {
            dispatch(
                editTask({
                    columnId,
                    task: taskToEdit,
                    updatedTask: {
                        title: newTask.title,
                        description: newTask.description,
                        comments: newTask.comments,
                    },
                })
            );
        } else {
            dispatch(addTask({ columnId, task: newTask }));
        }

        onClose();
    };

    const isValid = title.trim() && !titleError && !descriptionError;

    return {
        title,
        setTitle,
        description,
        setDescription,
        titleError,
        descriptionError,
        validateTitle,
        validateDescription,
        handleSubmit,
        isValid,
    };
}