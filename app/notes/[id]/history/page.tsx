import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, GitCommit } from 'lucide-react';

export default async function NoteHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const note = await prisma.note.findFirst({
    where: {
      id: id,
      user_id: session.user.id,
    }
  });

  if (!note) {
    redirect('/');
  }

  const versions = await prisma.noteVersion.findMany({
    where: { note_id: id },
    orderBy: { created_at: 'desc' }
  });

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '800px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-bg-alt:hover {
          background-color: var(--bg-alt) !important;
        }
      `}} />
      <div className="flex items-center gap-4" style={{ marginBottom: '32px' }}>
        <Link href={`/notes/${id}`} className="btn btn-ghost" style={{ padding: '0 8px', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={20} /> Back to Note
        </Link>
        <h1 style={{ fontSize: '28px', margin: 0 }}>Version History</h1>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Commit Log</h2>
        
        {versions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <GitCommit size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <p>No commits yet.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Edit your note and click "Commit" to create your first snapshot.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {versions.map((version) => (
              <Link 
                key={version.id} 
                href={`/notes/${id}/version/${version.id}`}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '16px', 
                  border: '1px solid var(--border)', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background-color 0.2s'
                }}
                className="hover-bg-alt"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <GitCommit size={16} style={{ color: 'var(--primary)' }} />
                    {version.commit_message || 'No commit message'}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {version.created_at.toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', paddingLeft: '24px' }}>
                  Title: {version.title}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
