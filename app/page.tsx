import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NoteGrid } from '@/components/NoteGrid';
import { SearchFilterBar } from '@/components/SearchFilterBar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string; sort?: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const sp = await searchParams;
  const query = sp?.q || '';
  const categoryId = sp?.c || '';
  const sort = sp?.sort || 'newest';

  let orderBy: Record<string, 'asc' | 'desc'> = { created_at: 'desc' };
  switch (sort) {
    case 'oldest':
      orderBy = { created_at: 'asc' };
      break;
    case 'alpha_asc':
      orderBy = { title: 'asc' };
      break;
    case 'alpha_desc':
      orderBy = { title: 'desc' };
      break;
    case 'updated':
      orderBy = { updated_at: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { created_at: 'desc' };
      break;
  }

  const [categories, notes] = await Promise.all([
    prisma.category.findMany({
      where: { user_id: session.user.id },
      orderBy: { name: 'asc' },
    }),
    prisma.note.findMany({
      where: {
        user_id: session.user.id,
        ...(query && {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        }),
        ...(categoryId === 'uncategorized'
          ? { category_id: null }
          : categoryId
            ? { category_id: categoryId }
            : {}),
      },
      include: {
        category: true,
      },
      orderBy,
      take: 24,
    })
  ]);

  return (
    <div className="container" style={{ padding: '24px' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>My Notes</h1>
      </div>

      <SearchFilterBar categories={categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))} />

      {notes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <h3 style={{ marginBottom: '16px' }}>
            {query || categoryId ? 'No notes match your search.' : 'No notes yet. Create your first one!'}
          </h3>
          <Link href="/notes/new" className="btn btn-primary">
            Create Note
          </Link>
        </div>
      ) : (
        <NoteGrid
          initialNotes={notes.map(note => ({
            id: note.id,
            title: note.title,
            content: note.content,
            categoryName: note.category?.name,
            categoryColor: note.category?.color,
            updatedAt: note.updated_at.toISOString(),
            isFavorite: note.is_favorite
          }))}
          query={query}
          categoryId={categoryId}
          sort={sort}
        />
      )}
    </div>
  );
}
