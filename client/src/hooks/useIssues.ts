import { useCallback, useEffect } from 'react';
import { issuesApi } from '../api/issues.api';
import { useIssueStore } from '../store/issueStore';
import { IssueFormData } from '../types';
import { useDebounce } from './useDebounce';

// Custom hook encapsulates all issue CRUD operations
// Components just call this hook — they don't know about the API layer
export function useIssues(page: number = 1) {
  const {
    filters,
    setIssues,
    addIssue,
    updateIssue: updateInStore,
    removeIssue,
    setLoading,
    setError,
  } = useIssueStore();

  // Debounce the search input — API only called 500ms after user stops typing
  const debouncedSearch = useDebounce(filters.search, 500);

  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await issuesApi.getAll({
        search: debouncedSearch,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        page,
        limit: 10,
      });
      setIssues(res.data.data, res.data.pagination, res.data.statusCounts);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.priority, page]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const createIssue = async (data: IssueFormData) => {
    const res = await issuesApi.create(data);
    addIssue(res.data.data);
    return res.data.data;
  };

  const updateIssue = async (id: string, data: Partial<IssueFormData & { status: string }>) => {
    const res = await issuesApi.update(id, data);
    updateInStore(id, res.data.data);
    return res.data.data;
  };

  const deleteIssue = async (id: string) => {
    await issuesApi.delete(id);
    removeIssue(id);
  };

  return { fetchIssues, createIssue, updateIssue, deleteIssue };
}