export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  projectId: number;
  assigneeId: number;
  createdAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}