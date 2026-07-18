'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createNote(title: string, content: string, categoryId: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const note = await prisma.note.create({
    data: {
      title,
      content,
      category_id: categoryId || null,
      user_id: session.user.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/categories');
  return note.id;
}

export async function updateNote(id: string, title: string, content: string, categoryId: string | null) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.note.updateMany({
    where: {
      id,
      user_id: session.user.id,
    },
    data: {
      title,
      content,
      category_id: categoryId || null,
    },
  });

  revalidatePath('/');
  revalidatePath(`/notes/${id}`);
  revalidatePath('/categories');
  return id;
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.note.deleteMany({
    where: {
      id,
      user_id: session.user.id,
    },
  });

  revalidatePath('/');
  revalidatePath('/categories');
}
