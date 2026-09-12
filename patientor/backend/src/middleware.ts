import { type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';

export const errorHandler = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  if (error instanceof Error && error.message === 'Patient not found') {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  console.error(error);
  next(error);
};
