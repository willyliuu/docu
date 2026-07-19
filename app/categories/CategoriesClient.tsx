'use client';

import React, { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import { toast } from 'sonner';

const PREDEFINED_COLORS = [
  '#7aa2f7', '#bb9af7', '#9ece6a', '#7dcfff', 
  '#ff9e64', '#f7768e', '#e0af68', '#73daca'
];

interface Category {
  id: string;
  name: string;
  color: string;
  _count: { notes: number };
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#7aa2f7');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const res = await updateCategory(editingId, name, color);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Category updated');
        setCategories(categories.map(c => c.id === editingId ? { ...c, name, color } : c));
        setEditingId(null);
        setName('');
        setColor('#7aa2f7');
      }
    } else {
      const res = await createCategory(name, color);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success('Category created');
        // Optimistic refresh, actual data fetched on server revalidate
        window.location.reload(); 
      }
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setColor(category.color);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deletingCategory.id);
      toast.success('Category deleted');
      setCategories(categories.filter(c => c.id !== deletingCategory.id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(false);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="container" style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Manage Categories</h1>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
        
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Category Name" 
            required 
            maxLength={100}
            style={{ flex: 1 }}
          />
          
          <div className="flex gap-2">
            {PREDEFINED_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: c,
                  border: color === c ? '2px solid white' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
          
          <Button type="submit">{editingId ? 'Save' : 'Create'}</Button>
          {editingId && <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setName(''); }}>Cancel</Button>}
        </form>
      </div>

      <div className="flex-col gap-4">
        {categories.map(category => (
          <div key={category.id} className="card flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CategoryBadge name={category.name} color={category.color} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {category._count.notes} notes
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleEdit(category)}>Edit</Button>
              <Button variant="destructive" onClick={() => setDeletingCategory(category)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!deletingCategory}
        title="Delete Category"
        message={`Are you sure you want to delete the "${deletingCategory?.name}" category? ${deletingCategory?._count.notes} notes will become uncategorized.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCategory(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
