'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { deleteNote } from './actions';
import { ConfirmModal } from '@/components/ConfirmModal';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(id);
      toast.success('Note deleted successfully');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete note');
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)} title="Delete Note" style={{ padding: '0 12px' }}>
        <Trash2 size={16} />
      </Button>

      <ConfirmModal
        isOpen={isOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
