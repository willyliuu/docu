'use client';

import React, { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ConfirmModal } from '@/components/ConfirmModal';
import { toast } from 'sonner';
import { Edit2, Trash2, Plus, Check, X } from 'lucide-react';

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
  const [showColorPicker, setShowColorPicker] = useState(false);
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
      } else if (res.category) {
        toast.success('Category created');
        setCategories([...categories, { ...res.category, _count: { notes: 0 } }]);
        setName('');
        setColor('#7aa2f7');
        setShowColorPicker(false);
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
      
      <div className="card" style={{ marginBottom: '32px', padding: '16px 24px' }}>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center flex-wrap" style={{ position: 'relative' }}>
          
          <div style={{ position: 'relative', flex: '1 1 300px', display: 'flex', alignItems: 'center' }}>
            {/* Color Indicator (Trigger) */}
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Choose Color"
              style={{
                position: 'absolute',
                left: '12px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: color,
                border: '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                zIndex: 2,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />

            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={editingId ? "Edit Category Name..." : "Create a new category..."}
              required 
              maxLength={100}
              style={{ 
                width: '100%', 
                paddingLeft: '44px', 
                paddingRight: '90px', 
                height: '48px', 
                borderRadius: '24px',
                backgroundColor: 'rgba(22, 22, 30, 0.5)',
                border: '1px solid var(--border-focus)',
                fontSize: '15px'
              }}
            />

            <Button 
              type="submit" 
              variant="ghost"
              style={{ 
                position: 'absolute', 
                right: '4px', 
                height: '40px', 
                padding: '0 16px', 
                borderRadius: '20px',
                color: 'var(--bg-main)',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '14px'
              }}
              title={editingId ? 'Save Category' : 'Create Category'}
            >
              {editingId ? 'Save' : 'Create'}
            </Button>
          </div>
          
          {editingId && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => { setEditingId(null); setName(''); setShowColorPicker(false); }} 
              style={{ padding: '0 12px' }}
              title="Cancel Edit"
            >
              <X size={20} />
            </Button>
          )}

          {/* Color Picker Popover */}
          {showColorPicker && (
            <div style={{
              position: 'absolute',
              top: '56px',
              left: '0',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              width: '220px',
              zIndex: 10,
              boxShadow: '0 16px 32px rgba(0,0,0,0.5), 0 0 12px rgba(125, 207, 255, 0.1)',
              animation: 'modal-pop 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {PREDEFINED_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setColor(c); setShowColorPicker(false); }}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '2px solid white' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    transform: color === c ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="flex-col gap-4">
        {categories.map(category => (
          <div key={category.id} className="card flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <CategoryBadge name={category.name} color={category.color} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {category._count.notes} notes
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleEdit(category)} title="Edit Category" style={{ padding: '0 12px', color: 'var(--primary)' }}>
                <Edit2 size={16} />
              </Button>
              <Button variant="destructive" onClick={() => setDeletingCategory(category)} title="Delete Category" style={{ padding: '0 12px' }}>
                <Trash2 size={16} />
              </Button>
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
