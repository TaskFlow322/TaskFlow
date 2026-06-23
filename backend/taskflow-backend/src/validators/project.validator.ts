import { body, param, query } from 'express-validator';

export const projectIdParamValidator = [
  param('id').isUUID().withMessage('id проекта должен быть UUID'),
];

export const createProjectValidator = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Название проекта должно быть от 1 до 100 символов'),

  body('description')
    .optional({ nullable: true })
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов'),
];

export const updateProjectValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Название проекта должно быть от 1 до 100 символов'),

  body('description')
    .optional({ nullable: true })
    .isLength({ max: 1000 })
    .withMessage('Описание не должно превышать 1000 символов'),
];

export const listProjectsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('search').optional().isLength({ max: 200 }),
];
