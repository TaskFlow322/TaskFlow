import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EntityId, Task, TaskStatus } from '../types/task.types';
import { mockTasks } from '../mocks/tasks.mock';
import { api } from '../api/axiosInstance';

interface TasksState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TasksState = {
  tasks: mockTasks,
  loading: false,
};

const STATUS_FROM_API: Record<string, TaskStatus> = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

const normalizeTask = (task: any): Task => ({
  id: task.id,
  title: task.title,
  description: task.description ?? '',
  status: STATUS_FROM_API[task.status] ?? task.status,
  projectId: task.projectId ?? null,
  assigneeId: task.assigneeId ?? null,
  createdAt: task.createdAt,
});

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const response = await api.get('/tasks');
  const tasks = response.data.data?.tasks ?? response.data.tasks ?? response.data;
  return Array.isArray(tasks) ? tasks.map(normalizeTask) : [];
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    moveTask: (state, action: PayloadAction<{ taskId: EntityId; newStatus: TaskStatus }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<EntityId>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { moveTask, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
