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
  title?: string;
}

export interface TaskDeletedPayload {
  id: string;
}

export interface CommentEventPayload {
  id: string;
  taskId: string;
  userId: string;
  content?: string;
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

export const emitTaskDeleted = (payload: TaskDeletedPayload): void => {
  getIO().emit('task:deleted', payload);
};

export const emitCommentCreated = (payload: CommentEventPayload): void => {
  getIO().emit('comment:created', payload);
};

export const emitCommentDeleted = (payload: CommentEventPayload): void => {
  getIO().emit('comment:deleted', payload);
};
