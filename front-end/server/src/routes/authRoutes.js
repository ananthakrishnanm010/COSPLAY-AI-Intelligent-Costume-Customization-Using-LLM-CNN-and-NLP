import { Router } from 'express';
import { registerHandler, loginHandler, getMeHandler } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validate(validateRegister), registerHandler);
router.post('/login', validate(validateLogin), loginHandler);
router.get('/me', protect, getMeHandler);

export default router;
