'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { toggleFavorite } from '@/app/notes/actions';

interface FavoriteToggleProps {
  id: string;
  isFavorite: boolean;
}

export const FavoriteToggle: React.FC<FavoriteToggleProps> = ({ id, isFavorite }) => {
  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (isPending) return;
    const newValue = !optimisticFavorite;
    setOptimisticFavorite(newValue);
    setIsPending(true);
    try {
      await toggleFavorite(id, newValue);
    } catch (error) {
      setOptimisticFavorite(!newValue);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      title={optimisticFavorite ? "Remove from favorites" : "Add to favorites"}
      style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer',
        color: optimisticFavorite ? '#e0af68' : 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        padding: '8px'
      }}
    >
      <Star size={20} fill={optimisticFavorite ? '#e0af68' : 'none'} />
    </button>
  );
};
