import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '../types/comment.types';
import { mockComments } from '../mocks/comments.mock';

interface CommentsState {
  comments: Comment[];
}

const initialState: CommentsState = {
  comments: mockComments,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    deleteComment: (state, action: PayloadAction<number>) => {
      state.comments = state.comments.filter(c => c.id !== action.payload);
    },
  },
});

export const { addComment, deleteComment } = commentsSlice.actions;
export default commentsSlice.reducer;