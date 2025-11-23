import React from 'react';
import { Order } from '../../types';
import { CheckCircle, Clock, ChefHat } from 'lucide-react';

interface WaiterDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

export const WaiterDashboard: React.FC<WaiterDashboardProps> = ({ orders, onUpdateStatus }) => {
  const pendingOrders = orders.filter(o => o.status !== 'paid');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-serif text-gold-400 mb-8">Kitchen & Waiter Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingOrders.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">No active orders</p>
            </div>
        )}

        {pendingOrders.map(order => (
          <div key={order.id} className={`rounded-xl border p-6 flex flex-col ${
            order.status === 'pending' ? 'bg-charcoal border-gold-500' : 
            order.status === 'preparing' ? 'bg-gray-900 border-blue-500' : 
            'bg-gray-900 border-green-500'
          }`}>
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">Table {order.tableId}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'pending' ? 'bg-gold-500 text-obsidian' :
                    order.status === 'preparing' ? 'bg-blue-500 text-white' :
                    'bg-green-500 text-white'
                }`}>
                    {order.status}
                </span>
            </div>
            
            <div className="flex-1 mb-6">
                <ul className="space-y-3">
                    {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-gray-300">
                            <span>{item.title}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-gray-400 text-sm">
                    <span>Total Items: {order.items.length}</span>
                    <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {order.status === 'pending' && (
                    <button 
                        onClick={() => onUpdateStatus(order.id, 'preparing')}
                        className="col-span-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                    >
                        <ChefHat size={16} /> Send to Kitchen
                    </button>
                )}
                {order.status === 'preparing' && (
                    <button 
                        onClick={() => onUpdateStatus(order.id, 'served')}
                        className="col-span-2 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                    >
                         Serve Table
                    </button>
                )}
                {order.status === 'served' && (
                    <button 
                        onClick={() => onUpdateStatus(order.id, 'paid')}
                        className="col-span-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16} /> Mark Paid
                    </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};