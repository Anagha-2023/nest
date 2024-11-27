// src/types/category.ts
import { Document } from 'mongoose';

export interface CategoryData {
  name: string;
  icon: string;
  isActive?: boolean;
}

export interface ICategory extends CategoryData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}