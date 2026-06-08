import { body } from 'express-validator';

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Пароль должен содержать минимум 6 символов')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Пароль должен содержать буквы и цифры')
];

export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Пароль обязателен')
];