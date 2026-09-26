import {Router} from 'express';
import verifyToken  from '../middleware/authMiddleware.js';
import {authorizeRoles} from '../middleware/authorizeRoles.js';
import { getAllUsers, deleteUser, updateUser } from '../controllers/adminController.js';

const router = Router();

router.get('/users', verifyToken, authorizeRoles('admin', 'teacher'), getAllUsers);
router.delete('/users/:id', verifyToken, authorizeRoles('admin'), deleteUser);
router.put('/users/:id', verifyToken, authorizeRoles('admin'), updateUser); 

export default router;