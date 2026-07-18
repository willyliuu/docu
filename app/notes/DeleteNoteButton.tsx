'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { deleteNote } from './actions';

export function DeleteNoteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      router.push('/');
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete Note
    </Button>
  );
}
