'use client';

import React, { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CategoryBadge } from '@/components/CategoryBadge';

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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (editingId) {
      const res = await updateCategory(editingId, name, color);
      if (res.error) {
        setError(res.error);
      } else {
        setCategories(categories.map(c => c.id === editingId ? { ...c, name, color } : c));
        setEditingId(null);
        setName('');
        setColor('#7aa2f7');
      }
    } else {
      const res = await createCategory(name, color);
      if (res.error) {
        setError(res.error);
      } else {
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

  const handleDelete = async (id: string, count: number) => {
    if (confirm(`Are you sure you want to delete this category? ${count} notes will become uncategorized.`)) {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="container" style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Manage Categories</h1>
      
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>{editingId ? 'Edit Category' : 'Create Category'}</h3>
        
        {error && <div style={{ color: 'var(--error)', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
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
              <Button variant="destructive" onClick={() => handleDelete(category.id, category._count.notes)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
