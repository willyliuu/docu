import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CategoryBadge } from '@/components/CategoryBadge';
import { DeleteNoteButton } from '../DeleteNoteButton';
import { FavoriteToggle } from '@/components/FavoriteToggle';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Edit2 } from 'lucide-react';
import { Mermaid } from '@/components/Mermaid';

type CodeProps = React.ClassAttributes<HTMLElement> & React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown };

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const note = await prisma.note.findFirst({
    where: {
      id: id,
      user_id: session.user.id,
    },
    include: {
      category: true
    }
  });

  if (!note) {
    redirect('/');
  }

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: '800px' }}>
      <div className="flex justify-between items-start" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{note.title}</h1>
          <div className="flex items-center gap-4">
            {note.category && (
              <CategoryBadge name={note.category.name} color={note.category.color} />
            )}
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Created: {note.created_at.toLocaleDateString()}
            </span>
            {note.created_at.getTime() !== note.updated_at.getTime() && (
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                (Updated: {note.updated_at.toLocaleDateString()})
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <FavoriteToggle id={note.id} isFavorite={note.is_favorite} />
          <Link href={`/notes/${note.id}/edit`} className="btn btn-ghost" title="Edit Note" style={{ padding: '0 12px', color: 'var(--primary)' }}>
            <Edit2 size={16} />
          </Link>
          <DeleteNoteButton id={note.id} />
        </div>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        <div className="markdown-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }: CodeProps) {
                const match = /language-(\w+)/.exec(className || '');
                if (!inline && match) {
                  if (match[1] === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                  }
                  return (
                    <SyntaxHighlighter
                      style={dracula as { [key: string]: React.CSSProperties }}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: '1em 0', borderRadius: '8px', background: 'var(--bg-alt)' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                }
                return (
                  <code className={className} style={{ background: 'var(--bg-alt)', padding: '2px 4px', borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
