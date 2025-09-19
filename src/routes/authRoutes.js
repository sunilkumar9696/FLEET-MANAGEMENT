import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

router.get('/getallusers', protect, authorizeRoles('Admin'), getAllUsers);
router.put('/updateuser/:id', protect, authorizeRoles('Admin'), updateUserById);
router.get('/getuser/:id', getUserById);
router.delete('/deleteuser/:id', protect, authorizeRoles('Admin'), deleteUserById);

export default router;
