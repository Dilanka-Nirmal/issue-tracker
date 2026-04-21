import { Request, Response, NextFunction } from 'express';

// This wrapper eliminates repetitive try/catch in every controller
// It catches async errors and forwards them to Express's error middleware
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;