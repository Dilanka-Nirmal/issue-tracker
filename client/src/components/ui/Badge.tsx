import React from 'react';
import { IssueStatus, IssuePriority } from '../../types';

// Color maps kept in one place — easy to update or theme
const STATUS_COLORS: Record<IssueStatus, string> = {
  Open: 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
  Closed: 'bg-gray-100 text-gray-600',
};

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
  Critical: 'bg-red-600 text-white',
};

interface BadgeProps {
  type: 'status' | 'priority';
  value: IssueStatus | IssuePriority;
}

export const Badge: React.FC<BadgeProps> = ({ type, value }) => {
  const colorClass =
    type === 'status'
      ? STATUS_COLORS[value as IssueStatus]
      : PRIORITY_COLORS[value as IssuePriority];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {value}
    </span>
  );
};