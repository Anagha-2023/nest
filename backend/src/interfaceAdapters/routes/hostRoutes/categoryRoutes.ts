import { Router } from 'express';
import * as categoryController from '../../controllers/hostControllers/categoryController';

const router = Router();

router.post('/addCategory', categoryController.createCategory);
router.get('/fetchAllCategory', categoryController.getAllCategories);
router.put('/updateCategory/:id', categoryController.updateCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);

export default router;