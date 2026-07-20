'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { restoreNoteVersion } from '@/app/notes/actions';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function RestoreVersionClient({ versionId, noteId }: { versionId: string, noteId: string }) {
  const router = useRouter();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    if (!confirm('Are you sure you want to restore this version? This will overwrite the current note content. A new commit will be automatically created as a backup.')) {
      return;
    }

    setIsRestoring(true);
    try {
      await restoreNoteVersion(versionId);
      toast.success('Note restored successfully!');
      router.push(`/notes/${noteId}`);
    } catch (err) {
      toast.error('Failed to restore version.');
      setIsRestoring(false);
    }
  };

  return (
    <Button 
      onClick={handleRestore} 
      disabled={isRestoring}
      variant="primary"
      className="flex items-center gap-2"
    >
      <RotateCcw size={16} />
      {isRestoring ? 'Restoring...' : 'Restore This Version'}
    </Button>
  );
}
