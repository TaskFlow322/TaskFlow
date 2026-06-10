import { Task, TaskStatus } from '../types/task.types';

// Mock данные — заменить на реальный API когда бэкенд будет готов
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Настроить роутинг',
    description: 'Подключить React Router и настроить все маршруты',
    status: 'todo',
    projectId: 1,
    assigneeId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Сделать страницу логина',
    description: 'Верстка и подключение формы логина',
    status: 'todo',
    projectId: 1,
    assigneeId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Подключить Redux',
    description: 'Настроить Redux Toolkit и слайсы',
    status: 'in_progress',
    projectId: 1,
    assigneeId: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Настроить API',
    description: 'Подключить axios и настроить interceptors',
    status: 'done',
    projectId: 1,
    assigneeId: 1,
    createdAt: new Date().toISOString(),
  },
];

// Симулируем задержку сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const tasksApi = {
  // Получить все задачи
  getTasks: async (): Promise<Task[]> => {
    await delay(300);
    return [...mockTasks];
  },

  // Обновить статус задачи (drag & drop)
  updateTaskStatus: async (taskId: number, newStatus: TaskStatus): Promise<Task> => {
    await delay(200);
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) throw new Error('Задача не найдена');
    task.status = newStatus;
    return { ...task };
  },

  // Обновить задачу
  updateTask: async (updatedTask: Task): Promise<Task> => {
    await delay(200);
    const index = mockTasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) throw new Error('Задача не найдена');
    mockTasks[index] = { ...updatedTask };
    return { ...mockTasks[index] };
  },

  // Удалить задачу
  deleteTask: async (taskId: number): Promise<void> => {
    await delay(200);
    const index = mockTasks.findIndex(t => t.id === taskId);
    if (index !== -1) mockTasks.splice(index, 1);
  },
};