import { useState } from "react";
import { validateColumnName } from "../utils/validation";

export function useColumnForm() {
    const [newColumnName, setNewColumnName] = useState("");
    const [columnNameError, setColumnNameError] = useState<string | null>(null);

    const handleNameChange = (value: string) => {
        setNewColumnName(value);
        const validation = validateColumnName(value);
        setColumnNameError(validation.errors[0] || null);
    };

    const validateAndReset = () => {
        const validation = validateColumnName(newColumnName);
        setColumnNameError(validation.errors[0] || null);

        if (validation.isValid) {
            const name = newColumnName.trim();
            setNewColumnName("");
            setColumnNameError(null);
            return name;
        }
        return null;
    };

    const isValid = newColumnName.trim().length > 0 && !columnNameError;

    return {
        newColumnName,
        columnNameError,
        handleNameChange,
        validateAndReset,
        isValid,
    };
}