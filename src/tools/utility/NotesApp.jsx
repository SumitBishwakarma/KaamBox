import { useState, useMemo } from 'react';
import { Plus, Trash2, Search, FileText, Edit3, Save, X } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useToast } from '../../context/ToastContext';

const NotesApp = () => {
    const [notes, setNotes] = useLocalStorage('kaambox-notes', []);
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const { toast } = useToast();

    const activeNote = notes.find(n => n.id === activeNoteId);

    const filteredNotes = useMemo(() => {
        if (!searchQuery.trim()) return notes;
        const query = searchQuery.toLowerCase();
        return notes.filter(note =>
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query)
        );
    }, [notes, searchQuery]);

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
        setEditTitle(newNote.title);
        setEditContent(newNote.content);
        setEditMode(true);
        toast.success('New note created');
    };

    const saveNote = () => {
        if (!activeNoteId) return;

        setNotes(notes.map(note =>
            note.id === activeNoteId
                ? { ...note, title: editTitle || 'Untitled', content: editContent, updatedAt: new Date().toISOString() }
                : note
        ));
        setEditMode(false);
        toast.success('Note saved');
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
        if (activeNoteId === id) {
            setActiveNoteId(null);
            setEditMode(false);
        }
        toast.info('Note deleted');
    };

    const selectNote = (note) => {
        if (editMode && activeNoteId) {
            // Auto-save current note
            saveNote();
        }
        setActiveNoteId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
        setEditMode(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPreview = (content) => {
        const text = content.replace(/[#*`_~\[\]]/g, '').trim();
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    };

    return (
        <div className="flex gap-4 h-[600px]">
            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 flex flex-col bg-[var(--bg-tertiary)] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-[var(--border-color)]">
                    <button onClick={createNote} className="btn-primary w-full">
                        <Plus size={18} />
                        New Note
                    </button>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-[var(--border-color)]">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="input-field !pl-9 !py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-auto">
                    {filteredNotes.length === 0 ? (
                        <div className="p-4 text-center text-[var(--text-muted)]">
                            {searchQuery ? 'No notes found' : 'No notes yet'}
                        </div>
                    ) : (
                        filteredNotes.map((note) => (
                            <div
                                key={note.id}
                                onClick={() => selectNote(note)}
                                className={`group p-3 border-b border-[var(--border-color)] cursor-pointer transition-colors ${activeNoteId === note.id
                                        ? 'bg-blue-500/10 border-l-2 border-l-blue-500'
                                        : 'hover:bg-[var(--bg-secondary)]'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{note.title}</h4>
                                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                                            {getPreview(note.content) || 'Empty note'}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] mt-2">
                                            {formatDate(note.updatedAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }}
                                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
                    {notes.length} notes
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 flex flex-col bg-[var(--bg-tertiary)] rounded-xl overflow-hidden">
                {activeNote ? (
                    <>
                        {/* Editor Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                            {editMode ? (
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Note title..."
                                    className="input-field !py-2 flex-1 mr-4"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-xl font-medium">{activeNote.title}</h2>
                            )}

                            <div className="flex gap-2">
                                {editMode ? (
                                    <>
                                        <button onClick={saveNote} className="btn-primary !py-2">
                                            <Save size={18} />
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditMode(false);
                                                setEditTitle(activeNote.title);
                                                setEditContent(activeNote.content);
                                            }}
                                            className="btn-secondary !py-2"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditMode(true)} className="btn-secondary !py-2">
                                        <Edit3 size={18} />
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {editMode ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="Start writing... (Markdown supported)"
                                    className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm"
                                />
                            ) : (
                                <div className="prose prose-invert max-w-none">
                                    {activeNote.content ? (
                                        <pre className="whitespace-pre-wrap font-sans text-[var(--text-primary)]">
                                            {activeNote.content}
                                        </pre>
                                    ) : (
                                        <p className="text-[var(--text-muted)] italic">
                                            This note is empty. Click Edit to add content.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                            Last updated: {formatDate(activeNote.updatedAt)}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p>Select a note or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesApp;
