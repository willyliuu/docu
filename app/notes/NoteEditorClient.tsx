"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ChevronLeft, GitCommit, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { commitNoteVersion, createNote, updateNote } from "./actions";

interface Category {
  id: string;
  name: string;
}

interface NoteEditorClientProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    category_id: string | null;
  };
  categories: Category[];
}

export default function NoteEditorClient({
  initialData,
  categories,
}: NoteEditorClientProps) {
  const router = useRouter();

  const [noteId, setNoteId] = useState(initialData?.id);
  const [title, setTitle] = useState(initialData?.title || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [content, setContent] = useState(initialData?.content || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  // Track last saved state to prevent unnecessary auto-saves
  const lastSavedState = useRef({
    title: initialData?.title || "",
    content: initialData?.content || "",
    categoryId: initialData?.category_id || "",
  });

  const handleSave = useCallback(
    async (
      options: { isAutoSave?: boolean; shouldNavigate?: boolean } = {}
    ) => {
      const { isAutoSave = false, shouldNavigate = false } = options;

      if (!title.trim() || !content.trim()) {
        if (!isAutoSave)
          toast.error("Please add a title and some content to your note.");
        return;
      }

      if (
        title === lastSavedState.current.title &&
        content === lastSavedState.current.content &&
        categoryId === lastSavedState.current.categoryId
      ) {
        if (shouldNavigate) router.push(noteId ? `/notes/${noteId}` : "/");
        return; // Nothing changed
      }

      setIsSaving(true);

      try {
        let currentNoteId = noteId;

        if (currentNoteId) {
          await updateNote(currentNoteId, title, content, categoryId || null);
        } else {
          currentNoteId = await createNote(title, content, categoryId || null);
          setNoteId(currentNoteId);
          // Only replace state if we are NOT navigating away, otherwise it can desync router
          if (!shouldNavigate) {
            window.history.replaceState(
              null,
              "",
              `/notes/${currentNoteId}/edit`
            );
          }
        }

        lastSavedState.current = { title, content, categoryId };

        if (isAutoSave) {
          toast.info("Auto-saved", { duration: 1500 });
        } else {
          toast.success("Note saved successfully!");
        }

        if (shouldNavigate) {
          router.push(`/notes/${currentNoteId}`);
        }
      } catch {
        if (!isAutoSave) toast.error("Failed to save note. Please try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [title, content, categoryId, noteId, router]
  );

  const handleCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) {
      toast.error("Commit message is mandatory");
      return;
    }
    if (!noteId) {
      toast.error("Please save the note first before committing a version.");
      return;
    }
    setIsCommitting(true);
    try {
      // Save current state first
      await updateNote(noteId, title, content, categoryId || null);
      // Then commit
      await commitNoteVersion(noteId, title, content, commitMessage);
      toast.success("Version committed successfully!");
      setIsCommitModalOpen(false);
      setCommitMessage("");
    } catch (err) {
      console.log("Error: ", err);
      toast.error("Failed to commit version.");
    } finally {
      setIsCommitting(false);
    }
  };

  // Auto-save every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleSave({ isAutoSave: true, shouldNavigate: false });
    }, 10000);
    return () => clearInterval(timer);
  }, [handleSave]);

  // Keyboard Shortcuts (Cmd+S, Cmd+N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Cmd+S should explicitly NOT navigate, just save the progress!
        handleSave({ isAutoSave: false, shouldNavigate: false });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        router.push("/notes/new");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, router]);

  return (
    <div
      className="flex-col"
      style={{ height: "calc(100vh - 74px)", display: "flex" }}
    >
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="flex items-center gap-4"
          style={{ marginBottom: "16px" }}
        >
          <Link
            href="/"
            className="btn btn-ghost"
            style={{
              padding: "0 8px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              color: "var(--text-secondary)",
            }}
          >
            <ChevronLeft size={20} />
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            style={{ flex: 1, fontSize: "24px", fontWeight: "bold" }}
          />
        </div>

        <div className="flex items-center justify-between gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "8px",
              padding: "10px 14px",
              outline: "none",
              maxWidth: "250px",
            }}
          >
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {noteId && (
            <Button
              variant="secondary"
              onClick={() => setIsCommitModalOpen(true)}
              className="flex items-center gap-2"
              title="Save a snapshot of this note to history"
            >
              <GitCommit size={16} />
              Commit
            </Button>
          )}

          <Button
            onClick={() =>
              handleSave({ isAutoSave: false, shouldNavigate: true })
            }
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {/* Commit Modal */}
      {isCommitModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="card" style={{ width: "400px", maxWidth: "90vw" }}>
            <h2 style={{ marginTop: 0 }}>Commit Version</h2>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              Create a snapshot of this note to track your progress and changes.
            </p>
            <form onSubmit={handleCommit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "8px",
                  }}
                >
                  Commit Message *
                </label>
                <Input
                  autoFocus
                  placeholder="e.g., Drafted v1 of API specs"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  style={{ width: "100%" }}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsCommitModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isCommitting || !commitMessage.trim()}
                >
                  {isCommitting ? "Committing..." : "Commit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
