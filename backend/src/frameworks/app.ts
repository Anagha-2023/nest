import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from '../interfaceAdapters/routes/userRoutes';
import adminRoutes from '../interfaceAdapters/routes/adminRoutes';
import hostRoutes from '../interfaceAdapters/routes/hostRoutes';

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// console.log(path.join(__dirname, 'uploads'));
// console.log('Uploads directory:', path.join(__dirname, '../../uploads'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hosts', hostRoutes);

export default app;
