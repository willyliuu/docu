"use client";

import { fetchNotesPage } from "@/app/notes/actions";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import { Button } from "./Button";
import { NoteCard } from "./NoteCard";
import { SkeletonCard } from "./SkeletonCard";

interface Note {
  id: string;
  title: string;
  content: string;
  categoryName?: string;
  categoryColor?: string;
  updatedAt: string;
  isFavorite?: boolean;
}

interface NoteGridProps {
  initialNotes: Note[];
  query: string;
  categoryId: string;
  sort: string;
}

export const NoteGrid: React.FC<NoteGridProps> = ({
  initialNotes,
  query,
  categoryId,
  sort,
}) => {
  const [localNotes, setLocalNotes] = useState<Note[]>(initialNotes);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialNotes.length === 24);
  const [autoLoadCount, setAutoLoadCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isFetchingRef = useRef(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset state when filters change
  useEffect(() => {
    setLocalNotes(initialNotes);
    setPage(1);
    setHasMore(initialNotes.length === 24);
    setAutoLoadCount(0);
  }, [initialNotes]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsLoadingMore(true);
    try {
      const nextNotes = await fetchNotesPage(page, query, categoryId, sort);

      if (nextNotes.length > 0) {
        setLocalNotes((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const uniqueNext = nextNotes.filter((n) => !existingIds.has(n.id));
          return [...prev, ...uniqueNext];
        });
        setPage((p) => p + 1);
        setAutoLoadCount((c) => c + 1);
      }

      if (nextNotes.length < 24) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more notes", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [page, query, categoryId, sort, hasMore]);

  // Intersection Observer for Infinite Scroll (up to 2 times)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          autoLoadCount < 2
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore, autoLoadCount]);

  const breakpointColumnsObj = {
    default: 4,
    1400: 3,
    1100: 2,
    768: 1,
  };

  return (
    <div className="note-grid-container">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {localNotes.map((note, index) => (
          <div 
            key={note.id} 
            className="animate-pop-up"
            style={{ 
              marginBottom: "24px",
              animationDelay: `${index * 50}ms`
            }}
          >
            <NoteCard
              id={note.id}
              title={note.title}
              content={note.content}
              categoryName={note.categoryName}
              categoryColor={note.categoryColor}
              updatedAt={note.updatedAt}
              isFavorite={note.isFavorite}
              query={query}
            />
          </div>
        ))}
        {isLoadingMore && (
          <>
            <div style={{ marginBottom: "24px" }}>
              <SkeletonCard />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <SkeletonCard />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <SkeletonCard />
            </div>
          </>
        )}
      </Masonry>

      {hasMore && (
        <div
          ref={observerTarget}
          style={{ padding: "24px", display: "flex", justifyContent: "center" }}
        >
          {autoLoadCount >= 2 && !isLoadingMore && (
            <Button onClick={loadMore} variant="secondary">
              Load More Notes
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
