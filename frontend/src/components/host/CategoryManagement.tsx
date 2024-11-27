import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  CategoryData 
} from '../../store/slices/categorySlice';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

// Category Icons (SVG Components)
const CategoryIcons = {
  PoolView: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 15c2.483 0 4.345-1.068 5-2 .655 1.068 2.517 2 5 2s4.345-1.068 5-2c.655 1.068 2.517 2 5 2" />
      <rect x="3" y="8" width="18" height="4" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="11" x2="21" y2="11" />
      <path d="M3 19h18" />
    </svg>
  ),
  AmazingView: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
      <path d="M12 15v6" />
      <path d="M9 15l3-3 3 3" />
    </svg>
  ),
  TreeHouse: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 13V3L4 9h16z" />
      <path d="M12 22v-8" />
      <path d="M4 9v10h16V9" />
      <path d="M16 16h2" />
      <path d="M6 16h2" />
    </svg>
  ),
  Lakeside: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 13.5L12 3l9 10.5" />
      <path d="M5 13.5l7-7 7 7" />
      <path d="M3 20.5L12 10l9 10.5" />
    </svg>
  ),
  BeachFront: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M17.5 7.5L12 2" />
      <path d="M12 2L6.5 7.5" />
      <path d="M3 12l9-9 9 9" />
      <path d="M12 22V12" />
      <path d="M3 20l18-8" />
    </svg>
  ),
  Rooms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 16V8" />
      <path d="M17 16V8" />
    </svg>
  ),
  Luxe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 10l-2.5-2.5" />
      <path d="M14 10l2.5-2.5" />
      <path d="M12 20v-8" />
      <path d="M3 7l9-4 9 4" />
      <path d="M12 3v18" />
    </svg>
  ),
  Mansions: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 20V6.5a3.5 3.5 0 1 1 7 0V20" />
      <path d="M10 11h4" />
      <path d="M4 21V10.5a3.5 3.5 0 1 1 7 0V21" />
      <path d="M4 11h4" />
    </svg>
  ),
  Farms: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 14l4-4 4 4" />
      <path d="M3 20v-5h18v5" />
      <path d="M12 20V8l-3-3H3v9" />
      <path d="M15 20V8l3-3h6v9" />
      <path d="M12 13h2" />
    </svg>
  ),
  Castles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M22 20V10l-5-5-5 5v10z" />
      <path d="M2 20V10l5-5 5 5v10z" />
      <path d="M12 15v4" />
      <path d="M7 15h10" />
      <path d="M12 11V7" />
    </svg>
  ),
  CountrySide: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M10 20v-6h4v6" />
      <path d="M4 10l8-8 8 8" />
      <path d="M6 18h12" />
      <path d="M16 10v8" />
      <path d="M8 10v8" />
    </svg>
  ),
  Camping: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 13L2 22h20L12 13z" />
      <path d="M12 22V3l8 9" />
      <path d="M12 13l-8 9" />
      <path d="M12 3l4 5" />
      <path d="M12 3l-4 5" />
    </svg>
  ),
  Islands: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
      <path d="M3 13c2.5 0 4.5-2 4.5-4.5S5.5 4 3 4" />
      <path d="M21 13c-2.5 0-4.5-2-4.5-4.5S18.5 4 21 4" />
      <path d="M12 22v-8" />
    </svg>
  )
};

const CategoryManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state: any) => state.categories);

  const [newCategory, setNewCategory] = useState<CategoryData>({
    name: '',
    icon: '',
    isActive: true
  });
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);

  useEffect(() => {
    dispatch(fetchCategories()as any);
  }, [dispatch]);

  const handleCreateCategory = () => {
    dispatch(createCategory(newCategory)as any);
    setNewCategory({ name: '', icon: '', isActive: true });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory._id) {
      dispatch(updateCategory({ 
        id: editingCategory._id, 
        categoryData: editingCategory 
      })as any);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    dispatch(deleteCategory(id)as any);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Category Management</h2>

        {/* Add/Edit Category Form */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input 
              type="text"
              placeholder="Category Name"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => 
                editingCategory 
                  ? setEditingCategory({...editingCategory, name: e.target.value}) 
                  : setNewCategory({...newCategory, name: e.target.value})
              }
              className="border p-2 rounded"
            />
            <select 
              value={editingCategory ? editingCategory.icon : newCategory.icon}
              onChange={(e) => 
                editingCategory 
                  ? setEditingCategory({...editingCategory, icon: e.target.value}) 
                  : setNewCategory({...newCategory, icon: e.target.value})
              }
              className="border p-2 rounded"
            >
              <option value="">Select Icon</option>
              {Object.keys(CategoryIcons).map(iconName => (
                <option key={iconName} value={iconName}>
                  {iconName}
                </option>
              ))}
            </select>
            {editingCategory ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleUpdateCategory}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Update Category
                </button>
                <button 
                  onClick={() => setEditingCategory(null)}
                  className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={handleCreateCategory}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
              >
                <PlusCircle className="mr-2" /> Add Category
              </button>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: CategoryData) => {
            const IconComponent = CategoryIcons[category.icon as keyof typeof CategoryIcons];
            return (
              <div 
                key={category._id} 
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  {IconComponent && <IconComponent />}
                  <span>{category.name}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category._id!)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;