// src/useCases/hostUseCases/categoryUseCases.ts
import * as categoryRepository from '../../repositories/hostRepository/categoryRepository';
import { CategoryData, ICategory } from '../../types/category';

export const createCategory = async (categoryData: CategoryData): Promise<ICategory> => {
    return await categoryRepository.createCategory(categoryData);
};

export const getAllCategories = async (): Promise<ICategory[]> => {
    return await categoryRepository.findAllCategories();
};

export const getCategoryById = async (id: string): Promise<ICategory | null> => {
    return await categoryRepository.findCategoryById(id);
};

export const updateCategoryById = async (id: string, categoryData: CategoryData): Promise<ICategory | null> => {
    return await categoryRepository.updateCategory(id, categoryData);
};

export const deleteCategoryById = async (id: string): Promise<void> => {
    await categoryRepository.deleteCategory(id);
};