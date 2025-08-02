"use client";

interface AddColumnFormProps {
  newColumnName: string;
  columnNameError: string | null;
  isValid: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddColumnForm({
  newColumnName,
  columnNameError,
  isValid,
  onNameChange,
  onSubmit,
}: AddColumnFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      onSubmit();
    }
  };

  return (
    <div className="min-w-[14rem] max-w-xs flex-shrink-0 bg-neutral-900 p-4 rounded-xl shadow border border-neutral-800 mt-4 sm:mt-0 snap-start">
      <input
        placeholder="New Column Name"
        value={newColumnName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full p-2 bg-neutral-800 text-white rounded mb-1 text-base ${
          columnNameError ? "border border-red-500" : ""
        }`}
      />
      {columnNameError && (
        <p className="text-red-500 mb-2 text-sm">{columnNameError}</p>
      )}
      <button
        onClick={onSubmit}
        disabled={!isValid}
        className="w-full text-sm text-green-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        + Add Column
      </button>
    </div>
  );
}
