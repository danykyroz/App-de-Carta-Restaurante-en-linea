import React, { useState, useMemo } from 'react';
import { MenuItem, Order, Currency, Language, CATEGORIES } from '../types';
import { formatCurrency } from '../utils/format';
import { DICTIONARY, INITIAL_ZONES } from '../constants';
import { Plus, ShoppingCart, Bell, X, Globe, DollarSign } from 'lucide-react';

interface CustomerMenuProps {
  items: MenuItem[];
  currency: Currency;
  language: Language;
  tableId: string;
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
  onPlaceOrder: (items: MenuItem[], tableId: string) => void;
  onCallWaiter: (tableId: string) => void;
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({
  items, currency, language, tableId, setCurrency, setLanguage, onPlaceOrder, onCallWaiter
}) => {
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [localTableId, setLocalTableId] = useState(tableId);
  const [showTableInput, setShowTableInput] = useState(!tableId);

  const t = DICTIONARY[language];

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter(i => i.category === selectedCategory);
  }, [items, selectedCategory]);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
    // Simple toast could go here
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    onPlaceOrder(cart, localTableId);
    setCart([]);
    setIsCartOpen(false);
    alert(t.orderSent);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.priceCOP, 0);

  if (showTableInput) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="bg-charcoal p-8 rounded-lg border border-gold-500/30 shadow-2xl max-w-md w-full text-center">
          <h2 className="text-2xl font-serif text-gold-400 mb-6">{t.menuTitle}</h2>
          <p className="text-gray-400 mb-6">Por favor, ingrese su número de mesa para comenzar.</p>
          <input 
            type="text" 
            value={localTableId}
            onChange={(e) => setLocalTableId(e.target.value)}
            placeholder="Mesa #"
            className="w-full bg-obsidian border border-gray-700 rounded px-4 py-3 text-white mb-4 focus:border-gold-500 outline-none"
          />
          <button 
            onClick={() => { if(localTableId) setShowTableInput(false); }}
            className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-3 rounded transition-colors"
          >
            Ver Carta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Controls Bar */}
      <div className="sticky top-16 z-40 bg-obsidian/95 backdrop-blur border-b border-gray-800 py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-gold-400">
                <span className="font-serif italic">{t.table} {localTableId}</span>
            </div>
            <div className="flex gap-3">
                <div className="relative group">
                    <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-gold-400 border border-gray-700 px-3 py-1 rounded-full">
                        <Globe size={14} /> {language.toUpperCase()}
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-charcoal border border-gray-700 rounded shadow-xl hidden group-hover:block">
                        {(['es', 'en', 'fr'] as Language[]).map(l => (
                            <button key={l} onClick={() => setLanguage(l)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-gray-300">
                                {l === 'es' ? 'Español' : l === 'en' ? 'English' : 'Français'}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative group">
                    <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-gold-400 border border-gray-700 px-3 py-1 rounded-full">
                        <DollarSign size={14} /> {currency}
                    </button>
                    <div className="absolute right-0 mt-2 w-32 bg-charcoal border border-gray-700 rounded shadow-xl hidden group-hover:block">
                        {(['COP', 'USD', 'EUR'] as Currency[]).map(c => (
                            <button key={c} onClick={() => setCurrency(c)} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 text-gray-300">
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        {/* Category Pills */}
        <div className="max-w-7xl mx-auto mt-4 overflow-x-auto flex gap-2 pb-2 no-scrollbar">
            <button 
                onClick={() => setSelectedCategory('All')}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'All' ? 'bg-gold-600 text-obsidian' : 'bg-gray-800 text-gray-400 hover:text-gold-400'}`}
            >
                All
            </button>
            {CATEGORIES.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gold-600 text-obsidian' : 'bg-gray-800 text-gray-400 hover:text-gold-400'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif text-center text-gold-400 mb-10 italic">{t.menuTitle}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-charcoal rounded-xl overflow-hidden border border-gray-800 hover:border-gold-500/50 transition-all duration-300 group shadow-lg flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-gray-100 font-medium">{item.title}</h3>
                    <span className="text-gold-400 font-bold whitespace-nowrap ml-2">
                        {formatCurrency(item.priceCOP, currency)}
                    </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
                <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-gray-800 hover:bg-gold-600 hover:text-obsidian text-gold-400 py-3 rounded border border-gray-700 hover:border-transparent transition-all flex items-center justify-center gap-2 font-medium uppercase tracking-wide text-xs"
                >
                    <Plus size={16} /> {t.addToOrder}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <button 
            onClick={() => { onCallWaiter(localTableId); alert(t.sentNotification); }}
            className="bg-charcoal hover:bg-gray-700 text-gray-300 p-4 rounded-full shadow-xl border border-gold-500/30 transition-colors"
            title={t.callWaiter}
        >
            <Bell size={24} />
        </button>
        <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-gold-600 hover:bg-gold-500 text-obsidian p-4 rounded-full shadow-xl relative transition-colors"
        >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
            )}
        </button>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-charcoal h-full flex flex-col border-l border-gray-800 shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="font-serif text-2xl text-gold-400">{t.viewCart}</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">{t.emptyCart}</p>
                    ) : (
                        <ul className="space-y-4">
                            {cart.map((item, idx) => (
                                <li key={`${item.id}-${idx}`} className="flex justify-between items-center bg-gray-800/50 p-3 rounded border border-gray-700">
                                    <div>
                                        <p className="text-gray-200 font-medium">{item.title}</p>
                                        <p className="text-gold-500 text-sm">{formatCurrency(item.priceCOP, currency)}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-300 p-2">
                                        <X size={18} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="p-6 border-t border-gray-800 bg-gray-900">
                    <div className="flex justify-between items-center mb-4 text-lg font-medium text-white">
                        <span>{t.total}</span>
                        <span className="text-gold-400 font-serif text-xl">{formatCurrency(totalPrice, currency)}</span>
                    </div>
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={cart.length === 0}
                        className="w-full bg-gold-600 hover:bg-gold-500 disabled:bg-gray-700 disabled:text-gray-500 text-obsidian font-bold py-4 rounded uppercase tracking-wider transition-all"
                    >
                        {t.confirmOrder}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};