import React from 'react';
import { marked } from 'marked';
import { FileText } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  minHeight?: string;
  /** When true, renders without the bordered preview box — used in reading view */
  bare?: boolean;
}

export function MarkdownRenderer({ content, minHeight, bare }: MarkdownRendererProps) {
  if (!content.trim()) {
    return (
      <div
        style={{
          minHeight: minHeight ?? '300px',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <FileText size={40} />
        <p style={{ margin: 0, fontSize: '16px' }}>Start writing to see the preview</p>
      </div>
    );
  }

  const html = marked(content) as string;

  return (
    <div
      className="md-body"
      style={bare ? undefined : {
        minHeight: minHeight ?? '300px',
        padding: '16px',
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: '8px',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
