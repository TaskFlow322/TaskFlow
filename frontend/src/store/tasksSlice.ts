import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../types/task.types';
import { tasksApi } from '../api/tasksApi';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async actions — подключены к API
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return await tasksApi.getTasks();
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, newStatus }: { taskId: number; newStatus: TaskStatus }) => {
    return await tasksApi.updateTaskStatus(taskId, newStatus);
  }
);

export const updateTask = createAsyncThunk('tasks/update', async (task: Task) => {
  return await tasksApi.updateTask(task);
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId: number) => {
  await tasksApi.deleteTask(taskId);
  return taskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Мгновенное обновление для drag & drop (без ожидания API)
    moveTaskLocally: (state, action: PayloadAction<{ taskId: number; newStatus: TaskStatus }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.newStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки задач';
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { moveTaskLocally } = tasksSlice.actions;
export default tasksSlice.reducer;