"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("../interfaceAdapters/routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("../interfaceAdapters/routes/adminRoutes"));
const hostRoutes_1 = __importDefault(require("../interfaceAdapters/routes/hostRoutes"));
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
// Parse incoming JSON requests
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../../uploads')));
// console.log(path.join(__dirname, 'uploads'));
// console.log('Uploads directory:', path.join(__dirname, '../../uploads'));
// Use routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/hosts', hostRoutes_1.default);
exports.default = app;
