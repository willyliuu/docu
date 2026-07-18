'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createCategory(name: string, color: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await prisma.category.create({
      data: {
        name,
        color,
        user_id: session.user.id,
      },
    });
    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'Category name already exists' };
    }
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, name: string, color: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await prisma.category.updateMany({
      where: {
        id,
        user_id: session.user.id,
      },
      data: {
        name,
        color,
      },
    });
    revalidatePath('/categories');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'Category name already exists' };
    }
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  try {
    await prisma.category.deleteMany({
      where: {
        id,
        user_id: session.user.id,
      },
    });
    revalidatePath('/categories');
    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to delete category' };
  }
}
