import { body, param, query } from 'express-validator';

export const taskIdParamValidator = [
  param('taskId').isUUID().withMessage('taskId должен быть UUID'),
];

export const commentIdParamValidator = [
  param('commentId').isUUID().withMessage('commentId должен быть UUID'),
];

export const createCommentValidator = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Текст комментария должен быть от 1 до 5000 символов'),
];

export const listCommentsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
];
