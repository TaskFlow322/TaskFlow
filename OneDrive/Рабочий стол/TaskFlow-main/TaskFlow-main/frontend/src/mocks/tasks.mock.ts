import { Task, Column } from '../types/task.types';

export const mockTasks: Task[] = [
  { id: 1, title: 'Настроить роутинг', description: '', status: 'todo', projectId: 1, assigneeId: 1, createdAt: new Date().toISOString() },
  { id: 2, title: 'Сделать страницу логина', description: '', status: 'todo', projectId: 1, assigneeId: 1, createdAt: new Date().toISOString() },
  { id: 3, title: 'Подключить Redux', description: '', status: 'in_progress', projectId: 1, assigneeId: 1, createdAt: new Date().toISOString() },
  { id: 4, title: 'Настроить API', description: '', status: 'done', projectId: 1, assigneeId: 1, createdAt: new Date().toISOString() },
];

export const mockColumns: Column[] = [
  { id: 'todo', title: '📋 To Do', tasks: mockTasks.filter(t => t.status === 'todo') },
  { id: 'in_progress', title: '⚙️ In Progress', tasks: mockTasks.filter(t => t.status === 'in_progress') },
  { id: 'done', title: '✅ Done', tasks: mockTasks.filter(t => t.status === 'done') },
];