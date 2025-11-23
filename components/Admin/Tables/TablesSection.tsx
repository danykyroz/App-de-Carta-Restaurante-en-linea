import React, { useState } from 'react';
import { Table } from '../../../types';
import { Trash2, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TablesSectionProps {
  tables: Table[];
  deletingId: string | null;
  setTables: (tables: Table[]) => void;
  onDelete: (id: string, name: string) => void;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ tables, deletingId, setTables, onDelete }) => {
  const [newTable, setNewTable] = useState<Partial<Table>>({ number: '', capacity: 4, zoneId: 'z1' });

  const handleAddTable = () => {
    if (!newTable.number) return;
    setTables([...tables, { id: Date.now().toString(), number: newTable.number!, capacity: newTable.capacity || 4, zoneId: newTable.zoneId }]);
    setNewTable({ number: '', capacity: 4, zoneId: 'z1' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-charcoal p-6 rounded-xl border border-gray-800 h-fit">
            <h3 className="text-xl text-gold-400 font-serif mb-6">Add Table</h3>
            <div className="space-y-4">
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newTable.number}
                    onChange={e => setNewTable({...newTable, number: e.target.value})}
                    placeholder="Table Number"
                />
                <input 
                    type="number"
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newTable.capacity}
                    onChange={e => setNewTable({...newTable, capacity: Number(e.target.value)})}
                    placeholder="Capacity"
                />
                <button onClick={handleAddTable} className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-2 rounded mt-4">
                    Add Table
                </button>
            </div>
        </div>
        <div className="lg:col-span-2 space-y-8">
            <div>
                <h3 className="text-xl text-white font-serif mb-4">Table Management</h3>
                <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full text-left text-gray-400">
                        <thead className="bg-gray-900 text-gray-200 uppercase text-sm">
                            <tr>
                                <th className="p-4">Table #</th>
                                <th className="p-4">Capacity</th>
                                <th className="p-4">Zone</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {tables.map(table => (
                                <tr 
                                    key={table.id} 
                                    className={`hover:bg-gray-800/50 transition-all duration-500 ${deletingId === table.id ? 'scale-95 opacity-0' : ''}`}
                                >
                                    <td className="p-4 font-medium text-white">{table.number}</td>
                                    <td className="p-4">{table.capacity} pax</td>
                                    <td className="p-4">{table.zoneId}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => onDelete(table.id, `Table ${table.number}`)} className="text-red-400 hover:text-red-300">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QR Codes Grid */}
            <div>
                <h3 className="text-xl text-white font-serif mb-4 flex items-center gap-2">
                    <QrCode className="text-gold-400" /> Table QR Codes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <div key={table.id} className="bg-white p-4 rounded-lg flex flex-col items-center text-center">
                            <h4 className="text-obsidian font-bold text-lg mb-2">T-{table.number}</h4>
                            <QRCodeSVG 
                                value={`${window.location.origin}/#menu?table=${table.number}`} 
                                size={100} 
                                fgColor="#0F0F11"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};