import { ValidationChain, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({
    success: false,
    error: {
      message: 'Validation error',
      details: errors.array().map((error) => ({
        field: error.type === 'field' ? error.path : 'unknown',
        message: error.msg,
      })),
    },
  });
};

export const validate = (validations: ValidationChain[]) => {
  return [...validations, handleValidationErrors];
};
