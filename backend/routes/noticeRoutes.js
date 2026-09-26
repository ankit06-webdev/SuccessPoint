import { Router } from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { createNotice, getAllNotices, deleteNotice } from '../controllers/noticeController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.route('/')
    .get(verifyToken, authorizeRoles('admin', 'teacher', 'student'), getAllNotices)
    .post(verifyToken, authorizeRoles('admin', 'teacher'), upload.array('attachments', 10), createNotice);

router.route('/:id')
    // .put(verifyToken, authorizeRoles('admin', 'teacher'), updateNotice)
    .delete(verifyToken, authorizeRoles('admin', 'teacher'), deleteNotice);


export default router;