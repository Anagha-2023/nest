// src/entities/Category.ts
import mongoose, { Document, Schema } from 'mongoose';
import { CategoryData } from '../types/category';

export interface ICategoryDocument extends Document, CategoryData {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);
export default Category;