import React, { useState } from 'react';
import { MenuItem, Category } from '../../../types';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';

interface ProductsSectionProps {
  items: MenuItem[];
  categories: Category[];
  deletingId: string | null;
  onSave: (item: Partial<MenuItem>) => void;
  onDelete: (id: string, title: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  items, categories, deletingId, onSave, onDelete 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem>>({
    title: '',
    description: '',
    priceCOP: 0,
    category: categories[0]?.name || '',
    imageUrl: '',
    available: true
  });

  const handleNewProduct = () => {
    setEditingItem({
        title: '',
        description: '',
        priceCOP: 0,
        category: categories[0]?.name || 'General',
        imageUrl: '',
        available: true,
        id: undefined
    });
    setIsFlipped(true);
  };

  const handleEditProduct = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsFlipped(true);
  };

  const handleSave = (item: Partial<MenuItem>) => {
    onSave(item);
    setIsFlipped(false);
  };

  const handleCancel = () => {
    setIsFlipped(false);
  };

  return (
    <div className="relative w-full max-w-full" style={{ perspective: '2000px' }}>
        <style>{`
            .card-flip-inner {
                position: relative;
                width: 100%;
                height: 100%;
                transition: transform 0.8s cubic-bezier(0.4, 0.2, 0.2, 1);
                transform-style: preserve-3d;
            }
            .card-flip-front, .card-flip-back {
                backface-visibility: hidden;
                width: 100%;
            }
            .card-flip-back {
                transform: rotateY(180deg);
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
            }
            .flipped {
                transform: rotateY(180deg);
            }
        `}</style>
        
        <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''} min-h-[600px]`}>
            <ProductList 
                items={items}
                categories={categories}
                deletingId={deletingId}
                onEdit={handleEditProduct}
                onDelete={onDelete}
                onNewProduct={handleNewProduct}
            />
            <ProductForm 
                item={editingItem}
                categories={categories}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    </div>
  );
};