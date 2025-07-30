import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Task = {
    id: string;
    title: string;
    description: string;
    comments: string;
};

export interface Comment {
    id: string;
    text: string;
}

type Column = {
    id: string;
    name: string;
    tasks: Task[];
};

type BoardState = {
    columns: Record<string, Column>; // dynamic keys
};

const initialState: BoardState = {
    columns: {
        todo: { id: "todo", name: "To Do", tasks: [] },
        inprogress: { id: "inprogress", name: "In Progress", tasks: [] },
        done: { id: "done", name: "Done", tasks: [] },
    },
};

const boardSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
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
                updatedTask: { title: string; description: string; comments: string };
            }>
        ) => {
            const tasks = state.columns[action.payload.columnId]?.tasks
            const taskIndex = tasks.findIndex((t) => t.id === action.payload.task.id);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title: action.payload.updatedTask.title,
                    description: action.payload.updatedTask.description,
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

export const { addTask, editTask, deleteTask, addColumn, renameColumn, deleteColumn } =
    boardSlice.actions;
export default boardSlice.reducer;
