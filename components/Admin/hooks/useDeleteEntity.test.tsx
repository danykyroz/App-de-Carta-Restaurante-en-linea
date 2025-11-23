import React, { act } from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDeleteEntity } from './useDeleteEntity';

const TestComponent: React.FC<{ onDeleted: (id: string) => void }> = ({ onDeleted }) => {
  const handlers = { product: (id: string) => onDeleted(id) };
  const { deleteModal, deletingId, promptDelete, confirmDelete, close } = useDeleteEntity(handlers, 500);

  return (
    <div>
      <div data-testid="isOpen">{String(deleteModal.isOpen)}</div>
      <div data-testid="id">{deleteModal.id ?? ''}</div>
      <div data-testid="deleting">{deletingId ?? ''}</div>
      <button onClick={() => promptDelete('abc', 'product', 'Title')}>prompt</button>
      <button onClick={() => confirmDelete()}>confirm</button>
      <button onClick={() => close()}>close</button>
    </div>
  );
};

describe('useDeleteEntity', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens modal and calls handler after confirm (with animation timeout)', async () => {
    const onDeleted = vi.fn();
    // Render and interactions wrapped in act to avoid warnings
    act(() => {
      render(<TestComponent onDeleted={onDeleted} />);
    });

    const promptBtn = screen.getByText('prompt');
    act(() => {
      fireEvent.click(promptBtn);
    });

    expect(screen.getByTestId('isOpen').textContent).toBe('true');
    expect(screen.getByTestId('id').textContent).toBe('abc');

    const confirmBtn = screen.getByText('confirm');
    act(() => {
      fireEvent.click(confirmBtn);
    });

    // After confirm, modal should be closed and deletingId should show immediately
    expect(screen.getByTestId('isOpen').textContent).toBe('false');
    // deletingId is set synchronously by the hook; test reads the rendered value
    expect(screen.getByTestId('deleting').textContent).toBe('abc');

    // Fast-forward timers to allow the handler to be called
    await vi.advanceTimersByTimeAsync(500);
    // Allow pending React state updates to flush
    await Promise.resolve();

    expect(onDeleted).toHaveBeenCalledWith('abc');

    // After timer finishes deletingId should be cleared
    await waitFor(() => expect(screen.getByTestId('deleting').textContent).toBe(''));
  });
});
