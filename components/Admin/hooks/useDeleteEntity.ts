import { useState } from 'react';

type DeleteType = 'product' | 'category' | 'table' | 'employee';
interface DeleteState {
  isOpen: boolean;
  id: string | null;
  type: DeleteType | null;
  title?: string;
}

type Handlers = Partial<Record<DeleteType, (id: string) => void>>;

export const useDeleteEntity = (handlers: Handlers, animationDuration = 500) => {
  const [deleteModal, setDeleteModal] = useState<DeleteState>({ isOpen: false, id: null, type: null });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const promptDelete = (id: string, type: DeleteType, title?: string) => {
    setDeleteModal({ isOpen: true, id, type, title });
  };

  const confirmDelete = () => {
    const { id, type } = deleteModal;
    if (!id || !type) return;

    // Start animation
    setDeletingId(id);
    setDeleteModal({ ...deleteModal, isOpen: false });

    setTimeout(() => {
      handlers[type]?.(id);

      // Cleanup
      setDeletingId(null);
      setDeleteModal({ isOpen: false, id: null, type: null });
    }, animationDuration);
  };

  const close = () => setDeleteModal({ ...deleteModal, isOpen: false });

  return {
    deleteModal,
    deletingId,
    promptDelete,
    confirmDelete,
    close,
  } as const;
};
