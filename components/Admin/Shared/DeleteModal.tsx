import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, title, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal Content */}
        <div className="relative bg-charcoal border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                <p className="text-gray-400 mb-6">
                    Are you sure you want to delete {title ? <span className="text-gold-400 font-bold">"{title}"</span> : 'this item'}? 
                    This action cannot be undone.
                </p>
                
                <div className="flex gap-3 w-full">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};