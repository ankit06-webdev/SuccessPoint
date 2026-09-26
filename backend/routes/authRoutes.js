import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getMyProfile} from '../controllers/authController.js';
import verifyToken  from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);

router.get('/me', verifyToken, getMyProfile);

export default router;