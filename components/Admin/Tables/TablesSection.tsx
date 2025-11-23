import React, { useState, useMemo } from 'react';
import { Table } from '../../../types';
import { Trash2, QrCode, Edit2, X, Save, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TablesSectionProps {
  tables: Table[];
  deletingId: string | null;
  setTables: (tables: Table[]) => void;
  onDelete: (id: string, name: string) => void;
}

// Helper validator
const validateTable = (table: Partial<Table>, existing: Table[]) => {
  const errors: Record<string, string> = {};

  if (!table.number?.toString().trim()) errors.number = 'Table Number is required';
  else if (existing.some((t) => t.number === table.number)) errors.number = 'Table Number already exists';

  if (!table.capacity || Number(table.capacity) <= 0) errors.capacity = 'Capacity must be at least 1';

  return errors;
};

export const TablesSection: React.FC<TablesSectionProps> = ({ tables, deletingId, setTables, onDelete }) => {
  const [newTable, setNewTable] = useState<Partial<Table>>({ number: '', capacity: 4, zoneId: 'z1' });
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Safe window origin for SSR
  const origin = useMemo(() => (typeof window !== 'undefined' ? window.location.origin : ''), []);

  const handleAddTable = () => {
    const validation = validateTable(newTable, tables);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? (crypto as any).randomUUID() : Date.now().toString();

    setTables([
      ...tables,
      {
        id,
        number: String(newTable.number),
        capacity: Number(newTable.capacity),
        zoneId: newTable.zoneId ?? 'z1',
      } as Table,
    ]);

    setNewTable({ number: '', capacity: 4, zoneId: 'z1' });
    setErrors({});
  };

  const handleUpdateTable = () => {
    if (!editingTable) return;

    const validation = validateTable(editingTable, tables.filter((t) => t.id !== editingTable.id));
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setTables(tables.map((t) => (t.id === editingTable.id ? editingTable : t)));
    setEditingTable(null);
    setErrors({});
  };

  // Memoized QR items
  const qrItems = useMemo(() => tables, [tables]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">

      {/* Form Column */}
      <div className="md:col-span-4 bg-charcoal p-6 rounded-xl border border-gray-800 h-fit sticky top-6">
        <h3 className="text-xl text-gold-400 font-serif mb-6">Add Table</h3>

        <div className="space-y-4">
          {/* Table Number */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Table Number</label>
            <div className="relative">
              <input
                aria-label="table-number"
                className={`w-full bg-gray-900 border rounded p-2 text-white focus:outline-none transition-colors ${
                  errors.number ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-gold-500'
                }`}
                value={newTable.number as string}
                onChange={(e) => {
                  setNewTable({ ...newTable, number: e.target.value });
                  if (errors.number) setErrors({ ...errors, number: undefined });
                }}
                placeholder="e.g. 10"
              />
              {errors.number && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                  <AlertCircle size={12} />
                  <span>{errors.number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Capacity (Pax)</label>
            <div className="relative">
              <input
                aria-label="capacity"
                type="number"
                min="1"
                className={`w-full bg-gray-900 border rounded p-2 text-white focus:outline-none transition-colors ${
                  errors.capacity ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-gold-500'
                }`}
                value={newTable.capacity as number}
                onChange={(e) => {
                  setNewTable({ ...newTable, capacity: Number(e.target.value) });
                  if (errors.capacity) setErrors({ ...errors, capacity: undefined });
                }}
                placeholder="4"
              />
              {errors.capacity && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                  <AlertCircle size={12} />
                  <span>{errors.capacity}</span>
                </div>
              )}
            </div>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">Zone ID</label>
            <input
              aria-label="zone-id"
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none transition-colors"
              value={newTable.zoneId as string}
              onChange={(e) => setNewTable({ ...newTable, zoneId: e.target.value })}
              placeholder="e.g. z1"
            />
          </div>

          <button
            onClick={handleAddTable}
            className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-2 rounded mt-4 shadow-lg shadow-gold-500/20"
          >
            Add Table
          </button>
        </div>
      </div>

      {/* Table List & QR Codes */}
      <div className="md:col-span-8 space-y-8">

        {/* Table List */}
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
                {tables.map((table) => (
                  <tr
                    key={table.id}
                    className={`transition-all duration-500 ${deletingId === table.id ? 'scale-95 opacity-0' : 'hover:bg-gray-800/50'}`}
                  >
                    <td className="p-4 font-medium text-white">{table.number}</td>
                    <td className="p-4">{table.capacity} pax</td>
                    <td className="p-4">{table.zoneId}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <button
                        aria-label="edit-table"
                        onClick={() => setEditingTable({ ...table })}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-500/10 rounded transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        aria-label="delete-table"
                        onClick={() => onDelete(table.id, `Table ${table.number}`)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded transition-colors"
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

        {/* QR Codes */}
        <div>
          <h3 className="text-xl text-white font-serif mb-4 flex items-center gap-2">
            <QrCode className="text-gold-400" /> Table QR Codes
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {qrItems.map((table) => (
              <div
                key={table.id}
                className="bg-white p-4 rounded-lg flex flex-col items-center text-center shadow-lg hover:shadow-gold-500/20 transition-all group hover:-translate-y-1"
              >
                <h4 className="text-obsidian font-bold text-lg mb-2">T-{table.number}</h4>

                <div className="bg-white p-1 rounded">
                  <QRCodeSVG
                    value={`${origin}/#menu?table=${encodeURIComponent(String(table.number))}`}
                    size={100}
                    fgColor="#0F0F11"
                    level="M"
                  />
                </div>

                <span className="text-xs text-gray-500 mt-2 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  Zone: {table.zoneId}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTable && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setEditingTable(null);
              setErrors({});
            }}
          ></div>

          <div className="relative bg-charcoal border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl text-gold-400 font-serif">Edit Table</h3>
              <button
                onClick={() => {
                  setEditingTable(null);
                  setErrors({});
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Table Number *</label>
                <input
                  required
                  className={`w-full bg-gray-900 border rounded-lg p-3 text-white focus:outline-none transition-colors ${
                    errors.number ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-gold-500'
                  }`}
                  value={editingTable.number}
                  onChange={(e) => {
                    setEditingTable({ ...editingTable, number: e.target.value });
                    if (errors.number) setErrors({ ...errors, number: undefined });
                  }}
                />
                {errors.number && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                    <AlertCircle size={12} />
                    <span>{errors.number}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Capacity (Pax) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  className={`w-full bg-gray-900 border rounded-lg p-3 text-white focus:outline-none transition-colors ${
                    errors.capacity ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-gold-500'
                  }`}
                  value={editingTable.capacity}
                  onChange={(e) => {
                    setEditingTable({ ...editingTable, capacity: Number(e.target.value) });
                    if (errors.capacity) setErrors({ ...errors, capacity: undefined });
                  }}
                />
                {errors.capacity && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-fade-in">
                    <AlertCircle size={12} />
                    <span>{errors.capacity}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Zone ID</label>
                <input
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-gold-500 outline-none transition-colors"
                  value={editingTable.zoneId}
                  onChange={(e) => setEditingTable({ ...editingTable, zoneId: e.target.value })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditingTable(null);
                    setErrors({});
                  }}
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
