export interface Comment {
  id: number;
  taskId: number;
  userId: number;
  userName: string;
  text: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  taskId: number;
  text: string;
}