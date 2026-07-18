import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
  className?: string;
}


export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ name, color, className = '' }) => {
  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: 'var(--surface)',
        color: color,
        border: `1px solid ${color}`,
        fontFamily: 'var(--font-jb-mono), monospace'
      }}
    >
      {name}
    </span>
  );
};
