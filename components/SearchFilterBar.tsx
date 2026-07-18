'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './Input';

import { Search } from 'lucide-react';

interface SearchFilterBarProps {
  categories: { id: string; name: string }[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('c') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }
      
      if (categoryId) {
        params.set('c', categoryId);
      } else {
        params.delete('c');
      }

      if (sort && sort !== 'newest') {
        params.set('sort', sort);
      } else {
        params.delete('sort');
      }

      router.push(`/?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, categoryId, sort, router, searchParams]);

  return (
    <div className="flex gap-4" style={{ marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none', display: 'flex' }}>
          <Search size={16} />
        </div>
        <Input 
          type="text" 
          placeholder="Search notes by title or content..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ paddingLeft: '36px' }}
        />
      </div>
      
      <div className="flex gap-4">
        <select 
          value={categoryId} 
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)', 
            color: 'var(--text-primary)', 
            borderRadius: '12px',
            padding: '10px 14px',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
          <option value="uncategorized">Uncategorized</option>
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          style={{ 
            backgroundColor: 'var(--surface)', 
            border: '1px solid var(--border)', 
            color: 'var(--text-primary)', 
            borderRadius: '12px',
            padding: '10px 14px',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alpha_asc">Alphabetical (A-Z)</option>
          <option value="alpha_desc">Alphabetical (Z-A)</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>
    </div>
  );
};
