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

export async function toggleFavorite(id: string, is_favorite: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  await prisma.note.updateMany({
    where: {
      id,
      user_id: session.user.id,
    },
    data: {
      is_favorite,
    },
  });

  revalidatePath('/');
  revalidatePath(`/notes/${id}`);
}

export async function getFavoriteNotes() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const favorites = await prisma.note.findMany({
    where: {
      user_id: session.user.id,
      is_favorite: true,
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      updated_at: 'desc'
    }
  });

  return favorites;
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
    content: note.content,
    categoryName: note.category?.name,
    categoryColor: note.category?.color,
    updatedAt: note.updated_at.toISOString(),
    isFavorite: note.is_favorite
  }));
}

export async function commitNoteVersion(noteId: string, title: string, content: string, commitMessage: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Verify the note belongs to the user
  const note = await prisma.note.findFirst({
    where: { id: noteId, user_id: session.user.id }
  });

  if (!note) throw new Error('Note not found or unauthorized');

  await prisma.noteVersion.create({
    data: {
      note_id: noteId,
      title,
      content,
      commit_message: commitMessage,
    }
  });

  revalidatePath(`/notes/${noteId}`);
  revalidatePath(`/notes/${noteId}/history`);
  return { success: true };
}

export async function restoreNoteVersion(versionId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Find the version and verify ownership through the note
  const version = await prisma.noteVersion.findUnique({
    where: { id: versionId },
    include: { note: true }
  });

  if (!version || version.note.user_id !== session.user.id) {
    throw new Error('Version not found or unauthorized');
  }

  // Restore the note content and title
  await prisma.note.update({
    where: { id: version.note_id },
    data: {
      title: version.title,
      content: version.content
    }
  });

  // Optionally, automatically commit this restoration
  await prisma.noteVersion.create({
    data: {
      note_id: version.note_id,
      title: version.title,
      content: version.content,
      commit_message: `Restored from version: ${version.commit_message}`,
    }
  });

  revalidatePath(`/notes/${version.note_id}`);
  revalidatePath(`/notes/${version.note_id}/history`);
  return { success: true, noteId: version.note_id };
}
