// Extending the Express Request type globally so TypeScript
// knows that req.user exists after authentication middleware runs
import { Request } from 'express';
import { IUser } from '../models/User.model';

// Extend Express Request with our user property
export interface AuthRequest extends Request {
  user?: IUser;
}