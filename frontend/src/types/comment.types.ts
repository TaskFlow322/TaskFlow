import { EntityId } from './task.types';

export interface Comment {
  id: EntityId;
  taskId: EntityId;
  userId: EntityId;
  userName: string;
  text: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  taskId: EntityId;
  text: string;
}
