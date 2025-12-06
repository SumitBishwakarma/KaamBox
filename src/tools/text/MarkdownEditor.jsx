import { useState, useMemo } from 'react';
import { Copy, Code, Eye, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Simple markdown to HTML converter
const parseMarkdown = (md) => {
    let html = md;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Blockquotes
    html = html.replace(/^\&gt; (.*$)/gim, '<blockquote>$1</blockquote>');

    // Horizontal rule
    html = html.replace(/^---$/gim, '<hr />');

    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');

    // Wrap consecutive li tags in ul
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Paragraphs
    html = html.split(/\n\n+/).map(p => {
        if (p.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr)/)) return p;
        return `<p>${p}</p>`;
    }).join('\n');

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
};

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState(`# Welcome to Markdown Editor

This is a **live preview** markdown editor.

## Features
- Real-time preview
- Copy HTML output
- Clean syntax

### Try these:
- **Bold text** with \`**text**\`
- *Italic text* with \`*text*\`
- \`inline code\` with backticks
- [Links](https://example.com)

\`\`\`
Code blocks with triple backticks
\`\`\`

> Blockquotes with > prefix

---

Enjoy writing!`);
    const [viewMode, setViewMode] = useState('split');
    const { toast } = useToast();

    const html = useMemo(() => parseMarkdown(markdown), [markdown]);

    const handleCopyHTML = () => {
        navigator.clipboard.writeText(html);
        toast.success('HTML copied to clipboard');
    };

    const handleCopyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
        toast.success('Markdown copied to clipboard');
    };

    const handleClear = () => {
        setMarkdown('');
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                    {[
                        { id: 'split', label: 'Split', icon: Code },
                        { id: 'preview', label: 'Preview', icon: Eye }
                    ].map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${viewMode === mode.id
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
              `}
                        >
                            <mode.icon size={16} />
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button onClick={handleCopyMarkdown} className="btn-secondary !py-2 !px-3 text-sm">
                        <Copy size={16} />
                        Copy MD
                    </button>
                    <button onClick={handleCopyHTML} className="btn-secondary !py-2 !px-3 text-sm">
                        <Code size={16} />
                        Copy HTML
                    </button>
                    <button onClick={handleClear} className="btn-secondary !py-2 !px-3 text-sm">
                        <RotateCcw size={16} />
                        Clear
                    </button>
                </div>
            </div>

            {/* Editor & Preview */}
            <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Markdown Input */}
                {viewMode === 'split' && (
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Markdown
                        </label>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="textarea-field !min-h-[500px] !font-mono !text-sm"
                            placeholder="Write your markdown here..."
                        />
                    </div>
                )}

                {/* Preview */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Preview
                    </label>
                    <div
                        className="bg-[var(--bg-tertiary)] rounded-xl p-6 min-h-[500px] overflow-auto prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{
                            '--tw-prose-headings': 'var(--text-primary)',
                            '--tw-prose-body': 'var(--text-secondary)',
                            '--tw-prose-links': 'var(--color-primary)',
                            '--tw-prose-code': 'var(--color-accent)',
                        }}
                    />
                </div>
            </div>

            {/* HTML Output */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    HTML Output
                </label>
                <pre className="bg-[var(--bg-tertiary)] rounded-xl p-4 overflow-auto max-h-[200px] text-sm font-mono text-[var(--text-muted)]">
                    {html}
                </pre>
            </div>
        </div>
    );
};

// Add styles for prose elements
const style = document.createElement('style');
style.textContent = `
  .prose h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary); }
  .prose h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; color: var(--text-primary); }
  .prose h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: var(--text-primary); }
  .prose p { margin: 0.75rem 0; color: var(--text-secondary); }
  .prose strong { color: var(--text-primary); font-weight: 600; }
  .prose em { font-style: italic; }
  .prose a { color: var(--color-primary); text-decoration: underline; }
  .prose code { background: var(--bg-secondary); padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875rem; color: var(--color-accent); }
  .prose pre { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
  .prose pre code { background: none; padding: 0; color: var(--text-primary); }
  .prose blockquote { border-left: 4px solid var(--color-primary); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: var(--text-muted); }
  .prose ul { list-style: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
  .prose li { margin: 0.25rem 0; color: var(--text-secondary); }
  .prose hr { border: none; border-top: 1px solid var(--border-color); margin: 1.5rem 0; }
  .prose img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
  .prose del { text-decoration: line-through; color: var(--text-muted); }
`;
document.head.appendChild(style);

export default MarkdownEditor;
