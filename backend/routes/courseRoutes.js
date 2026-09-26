import { Router } from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { getCourse, getCourses, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';

const router = Router();

router.route('/')
    .get(verifyToken, authorizeRoles('admin', 'teacher'), getCourses)
    .post(verifyToken, authorizeRoles('admin'), createCourse);

router.route('/:id')
    .get(verifyToken, authorizeRoles('admin', 'teacher'), getCourse)
    .put(verifyToken, authorizeRoles('admin'), updateCourse)
    .delete(verifyToken, authorizeRoles('admin'), deleteCourse);

export default router; 