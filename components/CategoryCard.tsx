'use client';

import React from 'react';
import { CategoryBadge } from './CategoryBadge';
import { Button } from './Button';
import { Edit2, Trash2 } from 'lucide-react';

interface CategoryData {
  id: string;
  name: string;
  color: string;
  _count: {
    notes: number;
  };
}

interface CategoryCardProps {
  category: CategoryData;
  index: number;
  onEdit: (category: CategoryData) => void;
  onDelete: (category: CategoryData) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  index,
  onEdit,
  onDelete
}) => {
  return (
    <div 
      className="card flex justify-between items-center flex-wrap gap-4 animate-pop-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-4">
        <CategoryBadge name={category.name} color={category.color} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {category._count.notes} notes
        </span>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          onClick={() => onEdit(category)} 
          title="Edit Category" 
          style={{ padding: '0 12px', color: 'var(--primary)' }}
        >
          <Edit2 size={16} />
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(category)} 
          title="Delete Category" 
          style={{ padding: '0 12px' }}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};
