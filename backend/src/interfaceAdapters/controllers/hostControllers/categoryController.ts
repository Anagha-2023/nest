import { Request, Response } from 'express';
import * as categoryUseCases from '../../../useCases/hostUseCases/categoryUseCases';
import { CategoryData } from '../../../types/category';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await categoryUseCases.createCategory(req.body as CategoryData);
        res.status(201).json({ status: 'success', data: category });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
        const categories = await categoryUseCases.getAllCategories();
        res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const category = await categoryUseCases.updateCategoryById(
            req.params.id,
            req.body as CategoryData
        );
        res.status(200).json({ status: 'success', data: category });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        await categoryUseCases.deleteCategoryById(req.params.id);
        res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};