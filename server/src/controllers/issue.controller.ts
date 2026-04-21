import { Response } from 'express';
import Issue from '../models/Issue.model';
import asyncHandler from '../utils/asyncHandler';
import { AuthRequest } from '../types/express';   // import AuthRequest

export const getIssues = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { search, status, priority, severity, page = '1', limit = '10' } = req.query;

  const query: Record<string, any> = {};
  if (search) query.$text = { $search: search as string };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (severity) query.severity = severity;

  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  const skip = (pageNum - 1) * limitNum;

  const [issues, total] = await Promise.all([
    Issue.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Issue.countDocuments(query),
  ]);

  const statusCounts = await Issue.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: issues,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
    statusCounts,
  });
});

export const getIssueById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issue = await Issue.findById(req.params.id).populate(
    'createdBy assignedTo',
    'name email'
  );

  if (!issue) {
    res.status(404).json({ message: 'Issue not found' });
    return;
  }

  res.status(200).json({ success: true, data: issue });
});

export const createIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, description, priority, severity, tags } = req.body;

  const issue = await Issue.create({
    title,
    description,
    priority,
    severity,
    tags,
    createdBy: req.user!._id,   // now TypeScript knows req.user exists
  });

  res.status(201).json({ success: true, data: issue });
});

export const updateIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!issue) {
    res.status(404).json({ message: 'Issue not found' });
    return;
  }

  res.status(200).json({ success: true, data: issue });
});

export const deleteIssue = asyncHandler(async (req: AuthRequest, res: Response) => {
  const issue = await Issue.findByIdAndDelete(req.params.id);

  if (!issue) {
    res.status(404).json({ message: 'Issue not found' });
    return;
  }

  res.status(200).json({ success: true, message: 'Issue deleted successfully' });
});