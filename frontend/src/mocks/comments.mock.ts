import { Comment } from '../types/comment.types';

export const mockComments: Comment[] = [
  {
    id: 1,
    taskId: 1,
    userId: 1,
    userName: 'Анна',
    text: 'Нужно обсудить с командой',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    taskId: 1,
    userId: 1,
    userName: 'Анна',
    text: 'Добавить примеры',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    taskId: 3,
    userId: 1,
    userName: 'Анна',
    text: 'Проверить совместимость',
    createdAt: new Date().toISOString(),
  },
];