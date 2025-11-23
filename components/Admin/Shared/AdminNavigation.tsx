import React from 'react';
import { UtensilsCrossed, SquareMenu, Grid, Users } from 'lucide-react';

export type AdminSection = 'products' | 'categories' | 'tables' | 'employees';

interface AdminNavigationProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="flex flex-wrap gap-8 border-b border-gray-800 mb-8 pb-1 overflow-x-auto no-scrollbar">
        <button 
            onClick={() => setActiveSection('products')}
            className={`flex items-center gap-3 pb-4 px-2 border-b-2 transition-all whitespace-nowrap ${activeSection === 'products' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
        >
            <UtensilsCrossed size={20} /> <span className="font-serif font-bold text-lg">Products</span>
        </button>
        <button 
            onClick={() => setActiveSection('categories')}
            className={`flex items-center gap-3 pb-4 px-2 border-b-2 transition-all whitespace-nowrap ${activeSection === 'categories' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
        >
            <SquareMenu size={20} /> <span className="font-serif font-bold text-lg">Categories</span>
        </button>
        <button 
            onClick={() => setActiveSection('tables')}
            className={`flex items-center gap-3 pb-4 px-2 border-b-2 transition-all whitespace-nowrap ${activeSection === 'tables' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
        >
            <Grid size={20} /> <span className="font-serif font-bold text-lg">Mesas y QR</span>
        </button>
        <button 
            onClick={() => setActiveSection('employees')}
            className={`flex items-center gap-3 pb-4 px-2 border-b-2 transition-all whitespace-nowrap ${activeSection === 'employees' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
        >
            <Users size={20} /> <span className="font-serif font-bold text-lg">Employees</span>
        </button>
    </nav>
  );
};