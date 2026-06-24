import { Request, Response } from 'express';
import { emitTaskMoved, emitTaskCreated } from '../events/taskEvents';

export const notifyTaskMoved = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, previousStatus, title } = req.body;

  if (!status || !previousStatus) {
    res.status(400).json({ success: false, error: { message: 'status и previousStatus обязательны' } });
    return;
  }

  emitTaskMoved({ id, status, previousStatus, title });

  res.json({ success: true });
};

export const notifyTaskCreated = (req: Request, res: Response): void => {
  const { id, title, status, priority } = req.body;

  if (!title) {
    res.status(400).json({ success: false, error: { message: 'title обязателен' } });
    return;
  }

  emitTaskCreated({ id: id ?? '', title, status: status ?? 'TODO', priority: priority ?? 'MEDIUM' });

  res.status(201).json({ success: true });
};
