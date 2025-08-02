import { useState, useCallback } from "react";
import { Task } from "../types";

export function useTaskModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColumnId, setSelectedColumnId] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task>();

    const openAddTaskModal = useCallback((columnId: string) => {
        setSelectedColumnId(columnId);
        setSelectedTask(undefined);
        setIsModalOpen(true);
    }, []);

    const openEditTaskModal = useCallback((columnId: string, task: Task) => {
        setSelectedColumnId(columnId);
        setSelectedTask(task);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return {
        isModalOpen,
        selectedColumnId,
        selectedTask,
        openAddTaskModal,
        openEditTaskModal,
        closeModal,
    };
}
