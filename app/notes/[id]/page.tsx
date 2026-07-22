import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { NoteViewClient } from './NoteViewClient';

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

  return <NoteViewClient note={note} />;
}
