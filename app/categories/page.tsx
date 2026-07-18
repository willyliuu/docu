import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import CategoriesClient from './CategoriesClient';
import { redirect } from 'next/navigation';

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const categories = await prisma.category.findMany({
    where: { user_id: session.user.id },
    include: {
      _count: {
        select: { notes: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return <CategoriesClient initialCategories={categories} />;
}
