import { Router } from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { getAllAssignments, createAssignment, updateAssignment, deleteAssignment } from '../controllers/assignmentController.js';

const router = Router();
router.route('/')
    .get(verifyToken, authorizeRoles('admin', 'teacher', 'student'), getAllAssignments)
    .post(verifyToken, authorizeRoles('admin', 'teacher'), upload.array('attachments', 10), createAssignment);

router.route('/:id')
    .put(verifyToken, authorizeRoles('admin', 'teacher'), updateAssignment)
    .delete(verifyToken, authorizeRoles('admin', 'teacher'), deleteAssignment);

export default router;