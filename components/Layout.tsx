import React from 'react';
import { Menu, Shield, Coffee, ChefHat } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col">
      <nav className="bg-charcoal border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onChangeView('landing')}>
              <ChefHat className="h-8 w-8 text-gold-500" />
              <span className="ml-2 text-xl font-serif font-bold text-gold-400 tracking-wider">LuxeMenu</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button 
                    onClick={() => onChangeView('landing')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'landing' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}>
                    Home
                </button>
                <button 
                    onClick={() => onChangeView('menu')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'menu' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}>
                    Client Menu
                </button>
                <button 
                    onClick={() => onChangeView('admin')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'admin' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}>
                    Admin
                </button>
                <button 
                    onClick={() => onChangeView('waiter')}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${currentView === 'waiter' ? 'text-gold-400' : 'text-gray-300 hover:text-white'}`}>
                    Waiter
                </button>
              </div>
            </div>
            {/* Mobile menu button would go here, omitted for brevity */}
          </div>
        </div>
      </nav>
      <main className="flex-grow relative">
        {children}
      </main>
      <footer className="bg-charcoal border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          &copy; 2024 LuxeMenu Experiences. All rights reserved.
        </div>
      </footer>
    </div>
  );
};