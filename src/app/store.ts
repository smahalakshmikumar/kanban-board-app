import { configureStore } from "@reduxjs/toolkit";
import boardReducer, { BoardState, hydrateState } from './features/board/boardSlice';

// Storage utilities
const STORAGE_KEY = "kanbanBoardState";

const storageUtils = {
    loadState(): BoardState | undefined {
        if (typeof window === "undefined") {
            return undefined; // SSR safety
        }
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (!serializedState) return undefined;
            return JSON.parse(serializedState);
        } catch {
            return undefined;
        }
    },

    saveState(state: BoardState): void {
        if (typeof window === "undefined") {
            return; // SSR safety
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Silently fail if localStorage is not available
        }
    }
};

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Initialize state from localStorage after store creation
if (typeof window !== "undefined") {
    const savedState = storageUtils.loadState();
    if (savedState) {
        store.dispatch(hydrateState(savedState));
    }

    // Subscribe to save state changes to localStorage
    store.subscribe(() => {
        const state = store.getState();
        storageUtils.saveState(state.board);
    });
}

export { storageUtils };