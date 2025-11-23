import React, { useState } from 'react';
import { Table } from '../../../types';
import { Trash2, QrCode, Edit2, X, Save } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TablesSectionProps {
  tables: Table[];
  deletingId: string | null;
  setTables: (tables: Table[]) => void;
  onDelete: (id: string, name: string) => void;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ tables, deletingId, setTables, onDelete }) => {
  const [newTable, setNewTable] = useState<Partial<Table>>({ number: '', capacity: 4, zoneId: 'z1' });
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const handleAddTable = () => {
    if (!newTable.number) return;
    setTables([...tables, { id: Date.now().toString(), number: newTable.number!, capacity: newTable.capacity || 4, zoneId: newTable.zoneId }]);
    setNewTable({ number: '', capacity: 4, zoneId: 'z1' });
  };

  const handleUpdateTable = () => {
    if (!editingTable || !editingTable.number) return;
    const updatedTables = tables.map(t => t.id === editingTable.id ? editingTable : t);
    setTables(updatedTables);
    setEditingTable(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
        {/* Form Column - Takes 4 of 12 columns (33%) */}
        <div className="md:col-span-4 bg-charcoal p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
            <h3 className="text-xl text-gold-400 font-serif mb-6">Add Table</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Table Number</label>
                    <input 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
                        value={newTable.number}
                        onChange={e => setNewTable({...newTable, number: e.target.value})}
                        placeholder="e.g. 10"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Capacity (Pax)</label>
                    <input 
                        type="number"
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
                        value={newTable.capacity}
                        onChange={e => setNewTable({...newTable, capacity: Number(e.target.value)})}
                        placeholder="4"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2">Zone ID</label>
                    <input 
                        className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
                        value={newTable.zoneId}
                        onChange={e => setNewTable({...newTable, zoneId: e.target.value})}
                        placeholder="e.g. z1"
                    />
                </div>
                <button onClick={handleAddTable} className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-2 rounded mt-4 shadow-lg shadow-gold-500/20">
                    Add Table
                </button>
            </div>
        </div>

        {/* Table List & QR Column - Takes 8 of 12 columns (66%) */}
        <div className="md:col-span-8 space-y-8">
            <div>
                <h3 className="text-xl text-white font-serif mb-4">Table Management</h3>
                <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden shadow-xl">
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
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => setEditingTable(table)} 
                                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded transition-colors"
                                            title="Edit Table"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(table.id, `Table ${table.number}`)} 
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded transition-colors"
                                            title="Delete Table"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {tables.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 italic">
                                        No tables added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* QR Codes Grid */}
            <div>
                <h3 className="text-xl text-white font-serif mb-4 flex items-center gap-2">
                    <QrCode className="text-gold-400" /> Table QR Codes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tables.map(table => (
                        <div key={table.id} className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow-lg hover:shadow-gold-500/20 transition-all group hover:-translate-y-1">
                            <h4 className="text-obsidian font-bold text-lg mb-2">T-{table.number}</h4>
                            <div className="bg-white p-1 rounded">
                                <QRCodeSVG 
                                    value={`${window.location.origin}/#menu?table=${table.number}`} 
                                    size={100} 
                                    fgColor="#0F0F11"
                                    level="M"
                                />
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 px-2 py-0.5 rounded">Zone: {table.zoneId}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Edit Table Modal */}
        {editingTable && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingTable(null)}></div>
                <div className="relative bg-charcoal border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl text-gold-400 font-serif">Edit Table</h3>
                        <button onClick={() => setEditingTable(null)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Table Number</label>
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                                value={editingTable.number}
                                onChange={e => setEditingTable({...editingTable, number: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Capacity (Pax)</label>
                            <input 
                                type="number"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                                value={editingTable.capacity}
                                onChange={e => setEditingTable({...editingTable, capacity: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Zone ID</label>
                            <input 
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                                value={editingTable.zoneId}
                                onChange={e => setEditingTable({...editingTable, zoneId: e.target.value})}
                            />
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={() => setEditingTable(null)}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-3 rounded-lg border border-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateTable}
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