import { getIO } from '../config/socket';

export interface TaskEventPayload {
  id: string;
  title: string;
  status: string;
  priority: string;
  projectId?: string | null;
  assigneeId?: string | null;
}

export interface TaskMovedPayload {
  id: string;
  previousStatus: string;
  status: string;
}

export const emitTaskCreated = (task: TaskEventPayload): void => {
  getIO().emit('task:created', task);
};

export const emitTaskUpdated = (task: TaskEventPayload): void => {
  getIO().emit('task:updated', task);
};

export const emitTaskMoved = (payload: TaskMovedPayload): void => {
  getIO().emit('task:moved', payload);
};
