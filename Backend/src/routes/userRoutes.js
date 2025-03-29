import express from 'express';
import userController from '../controller/userController.js'
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.get('/profile', protect, userController.getProfile)
router.patch('/profile', protect, userController.updateProfile)

export default router