export type EntityId = string | number;
export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: EntityId;
  title: string;
  description: string;
  status: TaskStatus;
  projectId?: EntityId | null;
  assigneeId?: EntityId | null;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}
