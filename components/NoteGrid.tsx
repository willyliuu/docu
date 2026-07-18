'use client';

import React from 'react';
import Masonry from 'react-masonry-css';
import { NoteCard } from './NoteCard';

interface NoteGridProps {
  notes: any[];
}

export const NoteGrid: React.FC<NoteGridProps> = ({ notes }) => {
  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1100: 2,
    768: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {notes.map(note => (
        <div key={note.id} style={{ marginBottom: '24px' }}>
          <NoteCard
            id={note.id}
            title={note.title}
            contentSnippet={note.contentSnippet}
            categoryName={note.categoryName}
            categoryColor={note.categoryColor}
            updatedAt={note.updatedAt}
          />
        </div>
      ))}
    </Masonry>
  );
};
