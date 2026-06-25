import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Comment, CreateCommentRequest } from '../types/comment.types';
import { api } from '../api/axiosInstance';

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchByTask',
  async (taskId: number) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async ({ taskId, text }: CreateCommentRequest) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { text });
    return response.data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ taskId, commentId }: { taskId: number; commentId: number }) => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return commentId;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки комментариев';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export default commentsSlice.reducer;