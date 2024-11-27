"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getAllCategories = exports.createCategory = void 0;
const categoryUseCases = __importStar(require("../../../useCases/hostUseCases/categoryUseCases"));
const createCategory = async (req, res) => {
    try {
        const category = await categoryUseCases.createCategory(req.body);
        res.status(201).json({ status: 'success', data: category });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.createCategory = createCategory;
const getAllCategories = async (_req, res) => {
    try {
        const categories = await categoryUseCases.getAllCategories();
        res.status(200).json({ status: 'success', data: categories });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.getAllCategories = getAllCategories;
const updateCategory = async (req, res) => {
    try {
        const category = await categoryUseCases.updateCategoryById(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: category });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        await categoryUseCases.deleteCategoryById(req.params.id);
        res.status(200).json({ status: 'success', message: 'Category deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.deleteCategory = deleteCategory;
