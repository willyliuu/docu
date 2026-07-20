import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, GitCommit } from 'lucide-react';
import RestoreVersionClient from './RestoreVersionClient';
import DiffViewerClient from './DiffViewerClient';

export default async function NoteVersionPage({ params }: { params: Promise<{ id: string, versionId: string }> }) {
  const { id, versionId } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const version = await prisma.noteVersion.findUnique({
    where: { id: versionId },
    include: { note: true }
  });

  if (!version || version.note.user_id !== session.user.id) {
    redirect('/');
  }

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '1400px' }}>
      <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-alt)', border: '1px solid var(--primary)', borderRadius: '8px' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GitCommit size={20} />
              Viewing Historical Snapshot
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              Committed on {version.created_at.toLocaleString()} <br />
              Message: <strong>{version.commit_message}</strong>
            </p>
          </div>
          <RestoreVersionClient versionId={version.id} noteId={version.note_id} />
        </div>
      </div>

      <div className="flex items-center gap-4" style={{ marginBottom: '32px' }}>
        <Link href={`/notes/${id}/history`} className="btn btn-ghost" style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} /> Back to History
        </Link>
      </div>

      <div className="card" style={{ padding: '40px', opacity: 0.9 }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
          {version.title}
        </h1>
        
        <DiffViewerClient oldValue={version.content} newValue={version.note.content} />
      </div>
    </div>
  );
}
