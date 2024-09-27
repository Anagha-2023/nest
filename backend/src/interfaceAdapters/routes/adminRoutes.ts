import express from 'express';

import {blockUser, getAllUsers, unblockUser,} from '../controllers/adminControllers/userManagement';
import { getAllHosts, blockHost, unblockHost } from '../controllers/adminControllers/hostManagement'; 
import { handleAdminLogin,handleLogout } from '../controllers/adminControllers/adminAuth';
import authMiddleware from '../../middlewares/authMiddleware';

const router = express.Router();

router.post('/admin-login', handleAdminLogin);

//User mangement
router.get('/user-management', getAllUsers);
router.patch('/block-user/:id', blockUser);
router.patch('/unblock-user/:id', unblockUser);

//Host Management
router.get('/host-management', getAllHosts);
router.patch('/block-host/:id', blockHost);
router.patch('/unblock-host/:id', unblockHost);

//Logout
router.post('/admin-logout', handleLogout)

export default router;