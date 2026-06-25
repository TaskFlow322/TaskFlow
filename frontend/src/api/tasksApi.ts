import { Task, TaskStatus } from '../types/task.types';
import { api } from './axiosInstance';

const STATUS_MAP: Record<TaskStatus, string> = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  done: 'DONE',
};

export const tasksApi = {
  // Получить все задачи
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Обновить статус задачи (drag & drop)
  updateTaskStatus: async (taskId: number, newStatus: TaskStatus): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/status`, {
      status: STATUS_MAP[newStatus],
    });
    return response.data;
  },

  // Обновить задачу
  updateTask: async (updatedTask: Task): Promise<Task> => {
    const response = await api.patch(`/tasks/${updatedTask.id}`, updatedTask);
    return response.data;
  },

  // Удалить задачу
  deleteTask: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};