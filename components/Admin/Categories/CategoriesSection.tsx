import React, { useState } from 'react';
import { Category } from '../../../types';
import { Trash2, Edit2, X, Save } from 'lucide-react';

interface CategoriesSectionProps {
  categories: Category[];
  deletingId: string | null;
  setCategories: (cats: Category[]) => void;
  onDelete: (id: string, name: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories, deletingId, setCategories, onDelete }) => {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Create new category
  const handleAddCategory = () => {
    if (!newCategory.name) return;
    setCategories([...categories, { id: Date.now().toString(), name: newCategory.name!, description: newCategory.description }]);
    setNewCategory({ name: '', description: '' });
  };

  // Update existing category
  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name) return;
    
    const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
    );
    
    setCategories(updatedCategories);
    setEditingCategory(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Add Category Form */}
        <div className="md:col-span-1 bg-charcoal p-6 rounded-xl border border-gray-800 h-fit">
            <h3 className="text-xl text-gold-400 font-serif mb-6">Add Category</h3>
            <div className="space-y-4">
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newCategory.name}
                    onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                    placeholder="Category Name"
                />
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newCategory.description}
                    onChange={e => setNewCategory({...newCategory, description: e.target.value})}
                    placeholder="Description (optional)"
                />
                <button onClick={handleAddCategory} className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-2 rounded mt-4">
                    Save Category
                </button>
            </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
            <h3 className="text-xl text-white font-serif mb-4">Categories List</h3>
            <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-gray-900 text-gray-200 uppercase text-sm">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Description</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {categories.map(cat => (
                            <tr 
                                key={cat.id} 
                                className={`hover:bg-gray-800/50 transition-all duration-500 ${deletingId === cat.id ? 'scale-95 opacity-0' : ''}`}
                            >
                                <td className="p-4 font-medium text-white">{cat.name}</td>
                                <td className="p-4">{cat.description}</td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingCategory(cat)} 
                                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded transition-colors"
                                        title="Edit Category"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(cat.id, cat.name)} 
                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Edit Category Modal */}
        {editingCategory && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingCategory(null)}></div>
                <div className="relative bg-charcoal border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl text-gold-400 font-serif">Edit Category</h3>
                        <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Name</label>
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                                value={editingCategory.name}
                                onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Description</label>
                            <textarea 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none resize-none h-24 transition-colors"
                                value={editingCategory.description}
                                onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
                            />
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-lg border border-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateCategory}
                                className="flex-1 bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg"
                            >
                                <Save size={18} /> Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};