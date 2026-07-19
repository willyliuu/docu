'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';


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

export async function fetchNotesPage(page: number, query: string, categoryId: string, sort: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

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

  const notes = await prisma.note.findMany({
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
    skip: page * 24,
    take: 24,
  });

  return notes.map(note => ({
    id: note.id,
    title: note.title,
    contentSnippet: note.content.substring(0, 600) + (note.content.length > 600 ? '...' : ''),
    categoryName: note.category?.name,
    categoryColor: note.category?.color,
    updatedAt: note.updated_at.toISOString()
  }));
}
