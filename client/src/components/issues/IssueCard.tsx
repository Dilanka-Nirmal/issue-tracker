import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, Tag } from 'lucide-react';
import { Issue } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface IssueCardProps {
  issue: Issue;
  onDelete: (issue: Issue) => void;  // Parent handles the confirmation modal
  onStatusChange: (id: string, status: string) => void;
}

// Formats ISO date string to a readable relative or absolute date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onDelete,
  onStatusChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
      {/* Header row — title + badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <button
          onClick={() => navigate(`/issues/${issue._id}`)}
          className="text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors leading-snug"
        >
          {issue.title}
        </button>
        <div className="flex gap-2 shrink-0">
          <Badge type="status" value={issue.status} />
          <Badge type="priority" value={issue.priority} />
        </div>
      </div>

      {/* Description preview — clamp to 2 lines */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
        {issue.description}
      </p>

      {/* Tags */}
      {issue.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Tag size={12} className="text-gray-400 shrink-0" />
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer — meta info + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <User size={12} />
            {issue.createdBy?.name || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {formatDate(issue.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Only show Resolve button if issue is not already closed/resolved */}
          {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStatusChange(issue._id, 'Resolved')}
            >
              Resolve
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/issues/${issue._id}`)}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(issue)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};