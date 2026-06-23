import { Router } from 'express';
import {
  createComment,
  deleteComment,
  listComments,
} from '../controllers/comment.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../validators/common.validator';
import {
  commentIdParamValidator,
  createCommentValidator,
  listCommentsValidator,
  taskIdParamValidator,
} from '../validators/comment.validator';

export const commentRouter = Router({ mergeParams: true });

commentRouter.use(authMiddleware);

commentRouter.get(
  '/',
  validate([...taskIdParamValidator, ...listCommentsValidator]),
  listComments
);

commentRouter.post(
  '/',
  validate([...taskIdParamValidator, ...createCommentValidator]),
  createComment
);

commentRouter.delete(
  '/:commentId',
  validate([...taskIdParamValidator, ...commentIdParamValidator]),
  deleteComment
);
