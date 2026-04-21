import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useIssues } from '../hooks/useIssues';
import { useIssueStore } from '../store/issueStore';
import { useAuthStore } from '../store/authStore';
import { StatusCounts } from '../components/issues/StatusCounts';
import { IssueFilters } from '../components/issues/IssueFilters';
import { IssueForm } from '../components/issues/IssueForm';
import { IssueCard } from '../components/issues/IssueCard';
import { Modal } from '../components/ui/Modal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { Issue, IssueFormData } from '../types';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { issues, pagination, isLoading } = useIssueStore();
  const { user, logout } = useAuthStore();
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Issue | null>(null);

  const { createIssue, updateIssue, deleteIssue } = useIssues(page);

  const handleCreate = async (data: IssueFormData) => {
    await createIssue(data);
    setIsCreateOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteIssue(deleteTarget._id);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Issue Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Status Summary */}
        <StatusCounts />

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <IssueFilters />
          <div className="flex gap-2">
            <button
              onClick={() => exportToCSV(issues)}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> CSV
            </button>
            <button
              onClick={() => exportToJSON(issues)}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> JSON
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus size={14} /> New Issue
            </button>
          </div>
        </div>

        {/* Issues Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-400">Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 mb-4">No issues found. Create your first one.</p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto"
            >
              <Plus size={14} /> Create Issue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onDelete={(issue) => setDeleteTarget(issue)}
                onStatusChange={async (id, status) => {
                  await updateIssue(id, { status });  // ← now works
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} ({pagination.total} issues)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Issue"
      >
        <IssueForm onSubmit={handleCreate} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Delete"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{' '}
          <strong className="text-gray-900">"{deleteTarget?.title}"</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;