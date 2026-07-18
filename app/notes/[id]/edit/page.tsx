import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import NoteEditorClient from '../../NoteEditorClient';
import { redirect } from 'next/navigation';

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
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

  const categories = await prisma.category.findMany({
    where: { user_id: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return <NoteEditorClient initialData={note} categories={categories} />;
}
