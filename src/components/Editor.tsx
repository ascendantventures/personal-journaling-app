import React, { useState, useRef, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import type { JournalEntry, Mood } from '../types';
import { MoodSelector } from './MoodSelector';
import { EditorToggle } from './EditorToggle';
import { MarkdownRenderer } from './MarkdownRenderer';

interface EditorProps {
  entry: Partial<JournalEntry> | null;
  onSave: (data: { title: string; body: string; mood: Mood }) => void;
  onCancel: () => void;
  onUnsavedChange: (hasChanges: boolean) => void;
}

export function Editor({ entry, onSave, onCancel, onUnsavedChange }: EditorProps) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [body, setBody] = useState(entry?.body ?? '');
  const [mood, setMood] = useState<Mood | null>(entry?.mood ?? null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [errors, setErrors] = useState<{ title?: string; mood?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = Boolean(entry?.id);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [body]);

  const checkUnsaved = (t: string, b: string, m: Mood | null) => {
    const hasChanges =
      t !== (entry?.title ?? '') ||
      b !== (entry?.body ?? '') ||
      m !== (entry?.mood ?? null);
    onUnsavedChange(hasChanges);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val.slice(0, 120));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    checkUnsaved(val, body, mood);
  };

  const handleBodyChange = (val: string) => {
    setBody(val);
    checkUnsaved(title, val, mood);
  };

  const handleMoodChange = (m: Mood) => {
    setMood(m);
    if (errors.mood) setErrors((prev) => ({ ...prev, mood: undefined }));
    checkUnsaved(title, body, m);
  };

  const handleSave = () => {
    const newErrors: { title?: string; mood?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!mood) newErrors.mood = 'Please select a mood';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onUnsavedChange(false);
    onSave({ title: title.trim(), body, mood: mood! });
  };

  const entryDate = entry?.createdAt
    ? new Date(entry.createdAt).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      })
    : new Date().toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });

  return (
    <div
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '40px 48px',
        background: 'var(--bg-surface)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-1)',
        animation: 'fadeInUp 200ms ease',
      }}
    >
      {/* Date */}
      <p
        style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginBottom: '20px',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          fontWeight: 500,
        }}
      >
        {entryDate}
      </p>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <input
          data-testid="entry-title"
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Give your entry a title…"
          maxLength={120}
          aria-label="Entry title"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '32px',
            fontWeight: 600,
            background: 'transparent',
            border: 'none',
            borderBottom: errors.title
              ? '2px solid var(--error)'
              : '2px solid transparent',
            padding: '0 0 8px',
            color: 'var(--text-primary)',
            width: '100%',
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={(e) => {
            if (!errors.title) e.target.style.borderBottomColor = 'var(--primary)';
          }}
          onBlur={(e) => {
            if (!errors.title) e.target.style.borderBottomColor = 'transparent';
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          {errors.title ? (
            <span style={{ color: 'var(--error)', fontSize: '12px' }}>{errors.title}</span>
          ) : <span />}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {title.length}/120
          </span>
        </div>
      </div>

      {/* Mood Selector */}
      <div style={{ marginBottom: '28px' }}>
        <MoodSelector value={mood} onChange={handleMoodChange} error={Boolean(errors.mood)} />
      </div>

      {/* Body */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap' as const,
            gap: '8px',
          }}
        >
          <label
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
          >
            What's on your mind?
          </label>
          <EditorToggle mode={editorMode} onChange={setEditorMode} />
        </div>
        <textarea
          data-testid="entry-body"
          ref={textareaRef}
          value={body}
          onChange={(e) => handleBodyChange(e.target.value)}
          placeholder="Write freely here. Markdown supported…"
          aria-label="Journal entry body"
          style={{
            display: editorMode === 'edit' ? 'block' : 'none',
            width: '100%',
            minHeight: '300px',
            background: 'var(--bg-surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '14px 16px',
            fontSize: '16px',
            lineHeight: '1.75',
            color: 'var(--text-primary)',
            outline: 'none',
            resize: 'none' as const,
            overflow: 'hidden',
            transition: 'all 150ms ease',
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
            e.target.style.boxShadow = 'var(--focus-ring)';
            e.target.style.background = 'var(--bg-surface)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
            e.target.style.background = 'var(--bg-surface-alt)';
          }}
        />
        {editorMode === 'preview' && (
          <MarkdownRenderer content={body} minHeight="300px" />
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '11px 22px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-alt)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={16} />
          Cancel
        </button>
        <button
          data-testid="save-entry"
          onClick={handleSave}
          style={{
            padding: '11px 22px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-dark)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(194, 120, 92, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Save size={16} />
          {isEditing ? 'Update entry' : 'Save entry'}
        </button>
      </div>
    </div>
  );
}
