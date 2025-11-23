import React, { useState } from 'react';
import { MenuItem, Category } from '../../../types';
import { Edit2, Trash2, Plus, Filter } from 'lucide-react';

interface ProductListProps {
  items: MenuItem[];
  categories: Category[];
  deletingId: string | null;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string, title: string) => void;
  onNewProduct: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  items, 
  categories, 
  deletingId, 
  onEdit, 
  onDelete,
  onNewProduct 
}) => {
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredItems = filterCategory === 'All' 
      ? items 
      : items.filter(item => item.category === filterCategory);

  return (
    <div className="card-flip-front">
        <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <button 
                    onClick={() => setFilterCategory('All')}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategory === 'All' ? 'bg-gold-600 text-obsidian' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setFilterCategory(cat.name)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filterCategory === cat.name ? 'bg-gold-600 text-obsidian' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            <button 
                onClick={onNewProduct}
                className="bg-gold-600 hover:bg-gold-500 text-obsidian px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-gold-500/20 transition-transform hover:scale-105 whitespace-nowrap"
            >
                <Plus size={20} /> New Product
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredItems.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-gray-900/50 rounded-lg border border-gray-800 border-dashed">
                    <Filter className="mx-auto h-12 w-12 text-gray-600 mb-3" />
                    <p className="text-gray-500 text-lg">No items found in {filterCategory}</p>
                    </div>
            ) : (
                filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        className={`flex flex-col bg-charcoal rounded-xl overflow-hidden border border-gray-800 hover:border-gold-500/40 transition-all duration-500 group hover:shadow-xl hover:shadow-black/50 ${deletingId === item.id ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                    >
                        <div className="relative h-56 w-full overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            
                            {/* Actions Overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                    onClick={() => onEdit(item)} 
                                    className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-transform hover:scale-110"
                                    title="Edit Product"
                                    >
                                    <Edit2 size={16} />
                                    </button>
                                    <button 
                                    onClick={() => onDelete(item.id, item.title)} 
                                    className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-500 transition-transform hover:scale-110"
                                    title="Delete Product"
                                    >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                                <span className="text-xs font-bold bg-gold-500 text-obsidian px-2 py-0.5 rounded">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg text-gray-200 font-serif font-medium leading-tight">{item.title}</h4>
                                <span className="text-gold-400 font-bold ml-2">${item.priceCOP.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};