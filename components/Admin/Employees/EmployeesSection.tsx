import React, { useState } from 'react';
import { Employee } from '../../../types';
import { Trash2 } from 'lucide-react';

interface EmployeesSectionProps {
  employees: Employee[];
  deletingId: string | null;
  setEmployees: (emps: Employee[]) => void;
  onDelete: (id: string, name: string) => void;
}

export const EmployeesSection: React.FC<EmployeesSectionProps> = ({ employees, deletingId, setEmployees, onDelete }) => {
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ name: '', role: 'waiter', email: '' });

  const handleAddEmployee = () => {
    if (!newEmployee.name) return;
    setEmployees([...employees, { id: Date.now().toString(), name: newEmployee.name!, role: newEmployee.role || 'waiter', email: newEmployee.email }]);
    setNewEmployee({ name: '', role: 'waiter', email: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-charcoal p-6 rounded-xl border border-gray-800 h-fit">
            <h3 className="text-xl text-gold-400 font-serif mb-6">Add Employee</h3>
            <div className="space-y-4">
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newEmployee.name}
                    onChange={e => setNewEmployee({...newEmployee, name: e.target.value})}
                    placeholder="Full Name"
                />
                <select 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newEmployee.role}
                    onChange={e => setNewEmployee({...newEmployee, role: e.target.value as any})}
                >
                    <option value="waiter">Waiter</option>
                    <option value="chef">Chef</option>
                    <option value="admin">Admin</option>
                </select>
                <input 
                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-gold-500 outline-none"
                    value={newEmployee.email}
                    onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                    placeholder="Email (optional)"
                />
                <button onClick={handleAddEmployee} className="w-full bg-gold-600 hover:bg-gold-500 text-obsidian font-bold py-2 rounded mt-4">
                    Add Employee
                </button>
            </div>
        </div>
        <div className="md:col-span-2">
            <h3 className="text-xl text-white font-serif mb-4">Staff Directory</h3>
            <div className="bg-charcoal rounded-lg border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-gray-400">
                    <thead className="bg-gray-900 text-gray-200 uppercase text-sm">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {employees.map(emp => (
                            <tr 
                                key={emp.id} 
                                className={`hover:bg-gray-800/50 transition-all duration-500 ${deletingId === emp.id ? 'scale-95 opacity-0' : ''}`}
                            >
                                <td className="p-4 font-medium text-white">{emp.name}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                                        emp.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' :
                                        emp.role === 'chef' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                                        'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                    }`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td className="p-4">{emp.email}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => onDelete(emp.id, emp.name)} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};