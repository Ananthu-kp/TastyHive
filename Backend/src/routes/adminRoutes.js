import express from 'express'
import adminController from '../controller/adminController.js'

const router = express.Router()

router.post('/login', adminController.login)
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/promote', adminController.promoteUser);
router.patch('/users/:id/demote', adminController.demoteUser);

export default router