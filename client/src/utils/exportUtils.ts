import { Issue } from '../types';

// Flatten the issue object for CSV (which is flat by nature)
const flattenIssue = (issue: Issue) => ({
  ID: issue._id,
  Title: issue.title,
  Description: issue.description,
  Status: issue.status,
  Priority: issue.priority,
  Severity: issue.severity,
  CreatedBy: issue.createdBy?.name || '',
  Tags: issue.tags.join('; '),
  CreatedAt: new Date(issue.createdAt).toLocaleString(),
  UpdatedAt: new Date(issue.updatedAt).toLocaleString(),
});

// Trigger a browser download
const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (issues: Issue[]) => {
  const rows = issues.map(flattenIssue);
  const headers = Object.keys(rows[0]).join(',');
  const csv = [
    headers,
    ...rows.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`) // Escape quotes
        .join(',')
    ),
  ].join('\n');

  downloadFile(csv, 'issues.csv', 'text/csv');
};

export const exportToJSON = (issues: Issue[]) => {
  const data = JSON.stringify(issues.map(flattenIssue), null, 2);
  downloadFile(data, 'issues.json', 'application/json');
};