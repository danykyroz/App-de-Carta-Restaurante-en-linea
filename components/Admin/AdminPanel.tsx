import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { MenuItem, Category, Table, Employee } from '../../types';
import { AdminNavigation, AdminSection } from './Shared/AdminNavigation';
import { DeleteModal } from './Shared/DeleteModal';
import { useDeleteEntity } from './hooks/useDeleteEntity';
import { ProductsSection } from './Products/ProductsSection';
import { CategoriesSection } from './Categories/CategoriesSection';
import { TablesSection } from './Tables/TablesSection';
import { EmployeesSection } from './Employees/EmployeesSection';

interface AdminPanelProps {
  items: MenuItem[];
  setItems: (items: MenuItem[]) => void;
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  tables: Table[];
  setTables: (tables: Table[]) => void;
  employees: Employee[];
  setEmployees: (emps: Employee[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  items, setItems, 
  categories, setCategories, 
  tables, setTables, 
  employees, setEmployees 
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('products');

  const handlers = {
    product: (id: string) => setItems(prev => prev.filter(i => i.id !== id)),
    category: (id: string) => setCategories(prev => prev.filter(c => c.id !== id)),
    table: (id: string) => setTables(prev => prev.filter(t => t.id !== id)),
    employee: (id: string) => setEmployees(prev => prev.filter(e => e.id !== id)),
  };

  const { deleteModal, deletingId, promptDelete, confirmDelete, close } = useDeleteEntity(handlers, 500);


  // ================= SAVE LOGIC =================
  const handleSaveProduct = (newItem: Partial<MenuItem>) => {
    if (!newItem.title || !newItem.priceCOP) {
        alert("Title and Price are required");
        return;
    }
    
    if (newItem.id) {
        // UPDATE EXISTING
        const updatedItems = items.map(item => 
            item.id === newItem.id 
            ? { ...newItem, priceCOP: Number(newItem.priceCOP) } as MenuItem 
            : item
        );
        setItems(updatedItems);
    } else {
        // CREATE NEW
        const item: MenuItem = {
            id: nanoid(),
            title: newItem.title!,
            description: newItem.description || '',
            priceCOP: Number(newItem.priceCOP),
            category: newItem.category || categories[0]?.name || 'General',
            imageUrl: newItem.imageUrl || 'https://picsum.photos/800/600',
            available: true
        };
        setItems([...items, item]);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian p-6 lg:p-10 overflow-x-hidden relative">
        <header className="mb-8">
            <h1 className="text-3xl font-serif text-white mb-2">Admin Dashboard</h1>
            <div className="text-sm text-gray-500 mb-6">
                LuxeMenu Management System v1.0
            </div>
            <AdminNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
        </header>
        
        <main className="w-full">
            {activeSection === 'products' && (
                <ProductsSection 
                    items={items}
                    categories={categories}
                    deletingId={deletingId}
                    onSave={handleSaveProduct}
                    onDelete={(id, title) => promptDelete(id, 'product', title)}
                />
            )}
            {activeSection === 'categories' && (
                <CategoriesSection 
                    categories={categories}
                    deletingId={deletingId}
                    setCategories={setCategories}
                    onDelete={(id, name) => promptDelete(id, 'category', name)}
                />
            )}
            {activeSection === 'tables' && (
                <TablesSection 
                    tables={tables}
                    deletingId={deletingId}
                    setTables={setTables}
                    onDelete={(id, name) => promptDelete(id, 'table', name)}
                />
            )}
            {activeSection === 'employees' && (
                <EmployeesSection 
                    employees={employees}
                    deletingId={deletingId}
                    setEmployees={setEmployees}
                    onDelete={(id, name) => promptDelete(id, 'employee', name)}
                />
            )}
        </main>

            <DeleteModal 
                isOpen={deleteModal.isOpen}
                title={deleteModal.title}
                onClose={() => close()}
                onConfirm={confirmDelete}
            />
    </div>
  );
};