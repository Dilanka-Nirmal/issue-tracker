// Centralized TypeScript types — shared across the entire frontend
// Single source of truth for data shapes

export interface User {
  id: string;
  name: string;
  email: string;
}

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueSeverity = 'Minor' | 'Major' | 'Critical' | 'Blocker';

export interface Issue {
  _id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdBy: User;
  assignedTo?: User;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueFormData {
  title: string;
  description: string;
  priority: IssuePriority;
  severity: IssueSeverity;
  tags: string[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface StatusCount {
  _id: IssueStatus;
  count: number;
}

export interface IssueFilters {
  search: string;
  status: IssueStatus | '';
  priority: IssuePriority | '';
}