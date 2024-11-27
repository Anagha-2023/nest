"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.findCategoryById = exports.findAllCategories = exports.createCategory = void 0;
const Category_1 = __importDefault(require("../../entities/Category"));
const documentToCategory = (doc) => {
    return {
        _id: doc._id.toString(),
        name: doc.name,
        icon: doc.icon,
        isActive: doc.isActive,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
};
const createCategory = async (categoryData) => {
    const category = new Category_1.default(categoryData);
    const savedCategory = await category.save();
    return documentToCategory(savedCategory);
};
exports.createCategory = createCategory;
const findAllCategories = async () => {
    const categories = await Category_1.default.find({ isActive: true });
    return categories.map(documentToCategory);
};
exports.findAllCategories = findAllCategories;
const findCategoryById = async (id) => {
    const category = await Category_1.default.findById(id);
    return category ? documentToCategory(category) : null;
};
exports.findCategoryById = findCategoryById;
const updateCategory = async (id, categoryData) => {
    const updated = await Category_1.default.findByIdAndUpdate(id, categoryData, { new: true });
    return updated ? documentToCategory(updated) : null;
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    await Category_1.default.findByIdAndDelete(id);
};
exports.deleteCategory = deleteCategory;
