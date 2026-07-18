import React from 'react';

interface CategoryBadgeProps {
  name: string;
  color: string;
  className?: string;
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
