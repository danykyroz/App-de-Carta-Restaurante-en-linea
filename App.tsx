import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CustomerMenu } from './components/CustomerMenu';
import { AdminPanel } from './components/Admin/AdminPanel';
import { WaiterDashboard } from './components/Waiter/WaiterDashboard';
import { MenuItem, Order, Currency, Language, Category, Table, Employee } from './types';
import { INITIAL_MENU, INITIAL_CATEGORIES, INITIAL_TABLES, INITIAL_EMPLOYEES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState('landing');
  
  // Core Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  
  // Transactional State
  const [orders, setOrders] = useState<Order[]>([]);
  
  // User Preferences
  const [currency, setCurrency] = useState<Currency>('COP');
  const [language, setLanguage] = useState<Language>('es');
  const [tableId, setTableId] = useState('');

  // Mock URL param parsing for demo
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('table=')) {
        const tId = hash.split('table=')[1];
        if (tId) {
            setTableId(tId);
            setView('menu');
        }
    }
  }, []);

  const handlePlaceOrder = (items: MenuItem[], tId: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      tableId: tId,
      items: items.map(i => ({ ...i, quantity: 1 })),
      status: 'pending',
      timestamp: Date.now(),
      totalCOP: items.reduce((sum, i) => sum + i.priceCOP, 0)
    };
    setOrders([newOrder, ...orders]);
  };

  const handleStatusUpdate = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return (
          <div className="h-[90vh] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-6xl md:text-8xl font-serif text-gold-400 mb-6 animate-fade-in">LuxeMenu</h1>
              <p className="text-gray-300 text-xl md:text-2xl mb-10 font-light tracking-wide">Experience the taste of luxury.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                    onClick={() => setView('menu')}
                    className="px-8 py-4 bg-gold-600 hover:bg-gold-500 text-obsidian font-bold text-lg rounded transition-all transform hover:scale-105"
                >
                    View Menu
                </button>
                <button 
                    onClick={() => setView('admin')}
                    className="px-8 py-4 bg-transparent border border-gray-500 hover:border-gold-400 text-gray-300 hover:text-gold-400 font-bold text-lg rounded transition-all"
                >
                    Admin Access
                </button>
              </div>
            </div>
          </div>
        );
      case 'menu':
        return (
          <CustomerMenu 
            items={menuItems}
            currency={currency}
            language={language}
            tableId={tableId}
            setCurrency={setCurrency}
            setLanguage={setLanguage}
            onPlaceOrder={handlePlaceOrder}
            onCallWaiter={(tId) => {
                 // In a real app, this would send a socket message
                 console.log(`Table ${tId} calling waiter`);
            }}
          />
        );
      case 'admin':
        return (
          <AdminPanel 
            items={menuItems} 
            setItems={setMenuItems}
            categories={categories}
            setCategories={setCategories}
            tables={tables}
            setTables={setTables}
            employees={employees}
            setEmployees={setEmployees}
          />
        );
      case 'waiter':
        return <WaiterDashboard orders={orders} onUpdateStatus={handleStatusUpdate} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout currentView={view} onChangeView={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;