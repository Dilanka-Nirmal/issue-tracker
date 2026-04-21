import React from 'react';
import { useIssueStore } from '../../store/issueStore';
import { IssueStatus } from '../../types';

const STATUS_CONFIG: Record<IssueStatus, { label: string; color: string; bg: string }> = {
  Open: { label: 'Open', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  'In Progress': { label: 'In Progress', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  Resolved: { label: 'Resolved', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  Closed: { label: 'Closed', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

export const StatusCounts: React.FC = () => {
  const { statusCounts } = useIssueStore();

  // Show all 4 statuses even if count is 0
  const allStatuses: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {allStatuses.map((status) => {
        const count = statusCounts.find((s) => s._id === status)?.count ?? 0;
        const config = STATUS_CONFIG[status];

        return (
          <div
            key={status}
            className={`border rounded-xl p-4 ${config.bg}`}
          >
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
          </div>
        );
      })}
    </div>
  );
};