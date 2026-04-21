import { create } from 'zustand';
import { Issue, IssueFilters, PaginationInfo, StatusCount } from '../types';

// Zustand store for issues — acts as client-side cache
// This prevents unnecessary re-fetches when navigating between pages
interface IssueState {
  issues: Issue[];
  selectedIssue: Issue | null;
  pagination: PaginationInfo | null;
  statusCounts: StatusCount[];
  filters: IssueFilters;
  isLoading: boolean;
  error: string | null;

  setIssues: (issues: Issue[], pagination: PaginationInfo, statusCounts: StatusCount[]) => void;
  setSelectedIssue: (issue: Issue | null) => void;
  setFilters: (filters: Partial<IssueFilters>) => void;
  addIssue: (issue: Issue) => void;
  updateIssue: (id: string, updated: Issue) => void;
  removeIssue: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useIssueStore = create<IssueState>((set) => ({
  issues: [],
  selectedIssue: null,
  pagination: null,
  statusCounts: [],
  filters: { search: '', status: '', priority: '' },
  isLoading: false,
  error: null,

  setIssues: (issues, pagination, statusCounts) =>
    set({ issues, pagination, statusCounts }),

  setSelectedIssue: (issue) => set({ selectedIssue: issue }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  addIssue: (issue) =>
    set((state) => ({ issues: [issue, ...state.issues] })),

  updateIssue: (id, updated) =>
    set((state) => ({
      issues: state.issues.map((i) => (i._id === id ? updated : i)),
    })),

  removeIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((i) => i._id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));