import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import NoteEditorClient from '../NoteEditorClient';
import { redirect } from 'next/navigation';

export default async function NewNotePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const categories = await prisma.category.findMany({
    where: { user_id: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return <NoteEditorClient categories={categories} />;
}
