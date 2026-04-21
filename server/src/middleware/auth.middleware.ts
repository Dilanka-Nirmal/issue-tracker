import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.model';
import { AuthRequest } from '../types/express';

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthRequest,    // typed directly, no asyncHandler wrapper
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User no longer exists' });
      return;
    }

    req.user = user as IUser;   // now works because req is AuthRequest
    next();

  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};