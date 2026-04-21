import mongoose, { Document, Schema } from 'mongoose';

// Enums prevent invalid values at the database level
export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueSeverity = 'Minor' | 'Major' | 'Critical' | 'Blocker';

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    severity: {
      type: String,
      enum: ['Minor', 'Major', 'Critical', 'Blocker'],
      default: 'Minor',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',       // Mongoose will populate this with User documents
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Compound index for common query patterns — improves search performance
issueSchema.index({ status: 1, priority: 1 });
issueSchema.index({ title: 'text', description: 'text' }); // Full-text search index

export default mongoose.model<IIssue>('Issue', issueSchema);