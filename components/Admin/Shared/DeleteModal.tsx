import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    title?: string;
    onClose: () => void;
    onConfirm: () => void;
}

// Simple focus trap utility
const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, title, onClose, onConfirm }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        // Save previously focused element
        previouslyFocused.current = document.activeElement as HTMLElement;

        // Focus the first focusable element inside the modal
        const el = modalRef.current;
        const focusable = el ? Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)) : [];
        if (focusable.length) focusable[0].focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }

            if (e.key === 'Tab' && el) {
                const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(n => n.offsetParent !== null);
                if (nodes.length === 0) return;
                const first = nodes[0];
                const last = nodes[nodes.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            // Restore focus
            try { previouslyFocused.current?.focus(); } catch (_) { /* ignore */ }
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

                {/* Modal Content */}
                <div
                    ref={modalRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-modal-title"
                    aria-describedby="delete-modal-desc"
                    className="relative bg-charcoal border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100"
                >
                        <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                        <AlertTriangle className="text-red-500 w-8 h-8" />
                                </div>

                                <h3 id="delete-modal-title" className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                                <p id="delete-modal-desc" className="text-gray-400 mb-6">
                                        Are you sure you want to delete {title ? <span className="text-gold-400 font-bold">"{title}"</span> : 'this item'}? This action cannot be undone.
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