import Category, { ICategoryDocument } from '../../entities/Category';
import { CategoryData, ICategory } from '../../types/category';

const documentToCategory = (doc: ICategoryDocument): ICategory => {
    return {
        _id: doc._id.toString(),
        name: doc.name,
        icon: doc.icon,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
};

export const createCategory = async (categoryData: CategoryData): Promise<ICategory> => {
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    return documentToCategory(savedCategory);
};

export const findAllCategories = async (): Promise<ICategory[]> => {
    const categories = await Category.find({ isActive: true });
    return categories.map(documentToCategory);
};

export const findCategoryById = async (id: string): Promise<ICategory | null> => {
    const category = await Category.findById(id);
    return category ? documentToCategory(category) : null;
};

export const updateCategory = async (id: string, categoryData: CategoryData): Promise<ICategory | null> => {
    const updated = await Category.findByIdAndUpdate(id, categoryData, { new: true });
    return updated ? documentToCategory(updated) : null;
};

export const deleteCategory = async (id: string): Promise<void> => {
    await Category.findByIdAndDelete(id);
};