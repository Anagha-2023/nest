"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userManagement_1 = require("../controllers/adminControllers/userManagement");
const hostManagement_1 = require("../controllers/adminControllers/hostManagement");
const adminAuth_1 = require("../controllers/adminControllers/adminAuth");
const router = express_1.default.Router();
router.post('/admin-login', adminAuth_1.handleAdminLogin);
//User mangement
router.get('/user-management', userManagement_1.getAllUsers);
router.patch('/block-user/:id', userManagement_1.blockUser);
router.patch('/unblock-user/:id', userManagement_1.unblockUser);
//Host Management
router.get('/host-management', hostManagement_1.getAllHosts);
router.patch('/block-host/:id', hostManagement_1.blockHost);
router.patch('/unblock-host/:id', hostManagement_1.unblockHost);
//Logout
router.post('/admin-logout', adminAuth_1.handleLogout);
exports.default = router;
