import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
    addColumn,
    deleteColumn,
    deleteTask,
    moveTask,
    renameColumn,
} from "../features/board/boardSlice";
import { DropResult } from "@hello-pangea/dnd";
import { sanitizeInput } from "../utils/validation";

export function useBoardActions() {
    const dispatch = useDispatch();

    const handleDragEnd = useCallback(
        (result: DropResult) => {
            const { destination, source } = result;
            if (
                !destination ||
                (destination.droppableId === source.droppableId &&
                    destination.index === source.index)
            )
                return;

            dispatch(
                moveTask({
                    fromColumnId: source.droppableId,
                    toColumnId: destination.droppableId,
                    fromIndex: source.index,
                    toIndex: destination.index,
                })
            );
        },
        [dispatch]
    );

    const addNewColumn = useCallback(
        (name: string) => {
            dispatch(addColumn({
                id: uuidv4(),
                name: sanitizeInput(name.trim())
            }));
        },
        [dispatch]
    );

    const renameExistingColumn = useCallback(
        (id: string, newName: string) => {
            dispatch(renameColumn({ id, newName }));
        },
        [dispatch]
    );

    const removeColumn = useCallback(
        (id: string) => {
            dispatch(deleteColumn(id));
        },
        [dispatch]
    );

    const removeTask = useCallback(
        (columnId: string, taskId: string) => {
            dispatch(deleteTask({ columnId, taskId }));
        },
        [dispatch]
    );

    return {
        handleDragEnd,
        addNewColumn,
        renameExistingColumn,
        removeColumn,
        removeTask,
    };
}
