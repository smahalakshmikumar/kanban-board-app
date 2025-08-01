import { Column, Task, UserComment } from "@/app/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BoardState = {
    columns: Record<string, Column>; // dynamic keys
};

const defaultState: BoardState = {
    columns: {
        todo: { id: "todo", name: "To Do", tasks: [] },
        inprogress: { id: "inprogress", name: "In Progress", tasks: [] },
        done: { id: "done", name: "Done", tasks: [] },
    },
};

const boardSlice = createSlice({
    name: "board",
    initialState: defaultState,
    reducers: {
        // Hydrate state from localStorage (called by store)
        hydrateState: (_, action: PayloadAction<BoardState>) => {
            return action.payload;
        },
        addTask: (
            state,
            action: PayloadAction<{ columnId: string; task: Task }>
        ) => {
            state.columns[action.payload.columnId]?.tasks.push(action.payload.task);
        },
        editTask: (
            state,
            action: PayloadAction<{
                columnId: string;
                task: Task;
                updatedTask: { title: string; description: string; comments: UserComment[] };
            }>
        ) => {
            const tasks = state.columns[action.payload.columnId]?.tasks;
            const taskIndex = tasks?.findIndex((t) => t.id === action.payload.task.id);
            if (taskIndex !== undefined && taskIndex !== -1 && tasks) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title: action.payload.updatedTask.title,
                    description: action.payload.updatedTask.description,
                    comments: action.payload.updatedTask.comments,
                };
            }
        },
        deleteTask: (
            state,
            action: PayloadAction<{ columnId: string; taskId: string }>
        ) => {
            const tasks = state.columns[action.payload.columnId]?.tasks;
            if (tasks) {
                state.columns[action.payload.columnId].tasks = tasks.filter(
                    (task) => task.id !== action.payload.taskId
                );
            }
        },
        moveTask: (
            state,
            action: PayloadAction<{
                fromColumnId: string;
                toColumnId: string;
                fromIndex: number;
                toIndex: number;
            }>
        ) => {
            const { fromColumnId, toColumnId, fromIndex, toIndex } = action.payload;

            const fromColumn = state.columns[fromColumnId];
            const toColumn = state.columns[toColumnId];

            if (!fromColumn || !toColumn) return;

            // Add bounds checking for array indices
            if (fromIndex < 0 || fromIndex >= fromColumn.tasks.length) return;
            if (toIndex < 0 || toIndex > toColumn.tasks.length) return;

            // Moving within the same column - using draft mutation consistently
            if (fromColumnId === toColumnId) {
                const [movedTask] = fromColumn.tasks.splice(fromIndex, 1);
                fromColumn.tasks.splice(toIndex, 0, movedTask);
                return;
            }

            // Moving across columns - using draft mutation
            const [movedTask] = fromColumn.tasks.splice(fromIndex, 1);
            toColumn.tasks.splice(toIndex, 0, movedTask);
        },
        addColumn: (state, action: PayloadAction<{ id: string; name: string }>) => {
            state.columns[action.payload.id] = {
                id: action.payload.id,
                name: action.payload.name,
                tasks: [],
            };
        },
        renameColumn: (
            state,
            action: PayloadAction<{ id: string; newName: string }>
        ) => {
            if (state.columns[action.payload.id]) {
                state.columns[action.payload.id].name = action.payload.newName;
            }
        },
        deleteColumn: (state, action: PayloadAction<string>) => {
            delete state.columns[action.payload];
        },
    },
});

export const {
    hydrateState,
    addTask,
    editTask,
    deleteTask,
    moveTask,
    addColumn,
    renameColumn,
    deleteColumn
} = boardSlice.actions;

export default boardSlice.reducer;