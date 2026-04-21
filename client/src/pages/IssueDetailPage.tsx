import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { issuesApi } from '../api/issues.api';
import { Issue, IssueFormData } from '../types';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { IssueForm } from '../components/issues/IssueForm';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<'Resolved' | 'Closed' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    issuesApi.getById(id).then((res) => {
      setIssue(res.data.data);
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async (data: IssueFormData) => {
    if (!issue) return;
    const res = await issuesApi.update(issue._id, data);
    setIssue(res.data.data);
    setIsEditOpen(false);
  };

  const handleStatusChange = async () => {
    if (!issue || !confirmStatus) return;
    const res = await issuesApi.update(issue._id, { status: confirmStatus });
    setIssue(res.data.data);
    setConfirmStatus(null);
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading...</div>;
  if (!issue) return <div className="p-8 text-center text-gray-400">Issue not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <button
              onClick={() => setIsEditOpen(true)}
              className="shrink-0 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge type="status" value={issue.status} />
            <Badge type="priority" value={issue.priority} />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {issue.severity}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
            <div>
              <span className="text-gray-500">Created by</span>
              <p className="font-medium text-gray-900">{issue.createdBy?.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Created</span>
              <p className="font-medium text-gray-900">
                {new Date(issue.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {issue.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {issue.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Quick Status Actions */}
          {issue.status !== 'Resolved' && issue.status !== 'Closed' && (
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => setConfirmStatus('Resolved')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                <CheckCircle size={16} /> Mark Resolved
              </button>
              <button
                onClick={() => setConfirmStatus('Closed')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-sm rounded-lg transition-colors"
              >
                <XCircle size={16} /> Close Issue
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Issue">
        <IssueForm onSubmit={handleUpdate} initialData={issue} />
      </Modal>

      {/* Status Confirmation Modal */}
      <Modal
        isOpen={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        title={`Mark as ${confirmStatus}`}
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to mark this issue as <strong>{confirmStatus}</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirmStatus(null)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusChange}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default IssueDetailPage;