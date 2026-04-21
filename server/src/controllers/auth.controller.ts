import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types/express';   // import AuthRequest

const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'],
  };
  return jwt.sign({ id }, secret, options);
};

const sendTokenResponse = (res: Response, statusCode: number, user: any) => {
  const token = signToken(user._id.toString());
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// POST /api/auth/register
export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  sendTokenResponse(res, 201, user);
});

// POST /api/auth/login
export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  sendTokenResponse(res, 200, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  res.status(200).json({ success: true, user: req.user }); // ← no longer errors
});