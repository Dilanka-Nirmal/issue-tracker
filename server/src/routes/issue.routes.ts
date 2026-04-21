import { Router } from 'express';
import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issue.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All issue routes require authentication
router.use(protect);

router.route('/').get(getIssues).post(createIssue);
router.route('/:id').get(getIssueById).patch(updateIssue).delete(deleteIssue);

export default router;