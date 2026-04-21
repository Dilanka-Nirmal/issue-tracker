import api from './axios';
import { User } from '../types';

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  getMe: () => api.get<{ user: User }>('/auth/me'),
};