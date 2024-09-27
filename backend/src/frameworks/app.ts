import express from 'express';
import cors from 'cors';
import userRoutes from '../interfaceAdapters/routes/userRoutes';
import adminRoutes from '../interfaceAdapters/routes/adminRoutes';
import hostRoutes from '../interfaceAdapters/routes/hostRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/hosts', hostRoutes)


export default app;