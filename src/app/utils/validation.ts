export const ValidationRules = {
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 100,
  TASK_DESCRIPTION_MAX_LENGTH: 500,
  TASK_DESCRIPTION_MIN_LENGTH: 1,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 300,
  COLUMN_NAME_MIN_LENGTH: 1,
  COLUMN_NAME_MAX_LENGTH: 25,
} as const;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTaskTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  const trimmed = title.trim();

  if (trimmed.length < ValidationRules.TASK_TITLE_MIN_LENGTH) {
    errors.push('Task title is required');
  }
  if (trimmed.length > ValidationRules.TASK_TITLE_MAX_LENGTH) {
    errors.push(`Task title cannot exceed ${ValidationRules.TASK_TITLE_MAX_LENGTH} characters`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateTaskDescription = (description: string): ValidationResult => {
  const errors: string[] = [];

  if (description.length < ValidationRules.TASK_DESCRIPTION_MIN_LENGTH) {
    errors.push('Task Description is required');
  }

  if (description.length > ValidationRules.TASK_DESCRIPTION_MAX_LENGTH) {
    errors.push(`Description cannot exceed ${ValidationRules.TASK_DESCRIPTION_MAX_LENGTH} characters`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateComment = (text: string): ValidationResult => {
  const errors: string[] = [];
  const trimmed = text.trim();

  if (trimmed.length > ValidationRules.COMMENT_MAX_LENGTH) {
    errors.push(`Comment cannot exceed ${ValidationRules.COMMENT_MAX_LENGTH} characters`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateColumnName = (name: string): ValidationResult => {
  const errors: string[] = [];
  const trimmed = name.trim();

  if (trimmed.length < ValidationRules.COLUMN_NAME_MIN_LENGTH) {
    errors.push('Column name is required');
  }
  if (trimmed.length > ValidationRules.COLUMN_NAME_MAX_LENGTH) {
    errors.push(`Column name cannot exceed ${ValidationRules.COLUMN_NAME_MAX_LENGTH} characters`);
  }

  return { isValid: errors.length === 0, errors };
};

// Sanitize user input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};