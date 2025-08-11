export type UserComment = {
  id: string;
  text: string;
  replies?: UserComment[];
};

export type Task = {
  id: string;
  title: string;
  description: string;
  comments: UserComment[];
};

export type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

export type BoardState = {
  columns: Record<string, Column>;
};
