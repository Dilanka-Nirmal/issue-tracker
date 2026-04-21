import React from 'react';
import { Search } from 'lucide-react';
import { useIssueStore } from '../../store/issueStore';

// Filters are managed in Zustand store so they persist across re-renders
export const IssueFilters: React.FC = () => {
  const { filters, setFilters } = useIssueStore();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input — debounced in useIssues hook, not here */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search issues..."
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value as any })}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">All Statuses</option>
        {['Open', 'In Progress', 'Resolved', 'Closed'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value as any })}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      >
        <option value="">All Priorities</option>
        {['Low', 'Medium', 'High', 'Critical'].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};