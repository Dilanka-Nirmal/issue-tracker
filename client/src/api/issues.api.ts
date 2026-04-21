import api from './axios';
import { Issue, IssueFilters, IssueFormData, PaginationInfo, StatusCount } from '../types';

interface IssuesResponse {
  success: boolean;
  data: Issue[];
  pagination: PaginationInfo;
  statusCounts: StatusCount[];
}

export const issuesApi = {
  getAll: (filters: Partial<IssueFilters> & { page?: number; limit?: number }) =>
    api.get<IssuesResponse>('/issues', { params: filters }),

  getById: (id: string) =>
    api.get<{ data: Issue }>(`/issues/${id}`),

  create: (data: IssueFormData) =>
    api.post<{ data: Issue }>('/issues', data),

  update: (id: string, data: Partial<IssueFormData & { status: string }>) =>
    api.patch<{ data: Issue }>(`/issues/${id}`, data),

  delete: (id: string) =>
    api.delete(`/issues/${id}`),
};