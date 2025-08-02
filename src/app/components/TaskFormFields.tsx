"use client";

interface TaskFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  titleError: string | null;
  descriptionError: string | null;
  validateTitle: (value: string) => boolean;
  validateDescription: (value: string) => boolean;
}

export function TaskFormFields({
  title,
  setTitle,
  description,
  setDescription,
  titleError,
  descriptionError,
  validateTitle,
  validateDescription,
}: TaskFormFieldsProps) {
  return (
    <>
      <input
        type="text"
        placeholder="Title"
        className={`w-full p-3 rounded mb-1 bg-neutral-800 text-white ${
          titleError ? "border border-red-500" : ""
        }`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => validateTitle(title)}
      />
      {titleError && <p className="text-red-500 mb-2 text-sm">{titleError}</p>}

      <textarea
        placeholder="Description"
        className={`w-full p-3 rounded mb-1 bg-neutral-800 text-white resize-none ${
          descriptionError ? "border border-red-500" : ""
        }`}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        onBlur={() => validateDescription(description)}
      />
      {descriptionError && (
        <p className="text-red-500 mb-2 text-sm">{descriptionError}</p>
      )}
    </>
  );
}
