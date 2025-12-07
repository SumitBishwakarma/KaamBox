import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Trash2, Palette, Edit2, Check } from 'lucide-react';
import { useEffect } from 'react';

const StickyNotes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    const colors = [
        '#fef08a', // yellow
        '#fca5a5', // red
        '#86efac', // green
        '#93c5fd', // blue
        '#c4b5fd', // purple
        '#fdba74'  // orange
    ];

    useEffect(() => {
        const saved = localStorage.getItem('stickyNotes');
        if (saved) setNotes(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('stickyNotes', JSON.stringify(notes));
    }, [notes]);

    const addNote = () => {
        if (!newNote.trim()) return;

        setNotes([...notes, {
            id: Date.now(),
            text: newNote,
            color: colors[Math.floor(Math.random() * colors.length)],
            createdAt: new Date().toISOString()
        }]);
        setNewNote('');
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const changeColor = (id, color) => {
        setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setEditText(note.text);
    };

    const saveEdit = (id) => {
        setNotes(notes.map(n => n.id === id ? { ...n, text: editText } : n));
        setEditingId(null);
        setEditText('');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Sticky Notes</h2>
                <p className="text-[var(--text-muted)] text-sm">Quick colorful notes</p>
            </div>

            <div className="space-y-4">
                {/* Add Note */}
                <div className="flex gap-2">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Write a note..."
                        className="input flex-1 resize-none h-20"
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addNote())}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addNote}
                    className="btn-primary w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                </motion.button>

                {/* Notes Grid */}
                {notes.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No notes yet. Add one above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {notes.map(note => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02, rotate: Math.random() * 4 - 2 }}
                                className="p-4 rounded-xl shadow-lg min-h-32 relative"
                                style={{ backgroundColor: note.color }}
                            >
                                {editingId === note.id ? (
                                    <div className="flex flex-col h-full">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="flex-1 bg-transparent resize-none text-gray-800 text-sm focus:outline-none"
                                            autoFocus
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => saveEdit(note.id)}
                                            className="self-end p-1 rounded bg-green-500 text-white"
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-800 text-sm whitespace-pre-wrap pr-8">
                                            {note.text}
                                        </p>
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => startEdit(note)}
                                                className="p-1 rounded bg-black/10"
                                            >
                                                <Edit2 className="w-3 h-3 text-gray-700" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => deleteNote(note.id)}
                                                className="p-1 rounded bg-black/10"
                                            >
                                                <Trash2 className="w-3 h-3 text-gray-700" />
                                            </motion.button>
                                        </div>
                                        <div className="absolute bottom-2 left-2 flex gap-1">
                                            {colors.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => changeColor(note.id, c)}
                                                    className={`w-4 h-4 rounded-full border ${c === note.color ? 'border-gray-600' : 'border-transparent'}`}
                                                    style={{ backgroundColor: c }}
                                                />
                                            ))}
                                        </div>
                                        <p className="absolute bottom-2 right-2 text-xs text-gray-600/50">
                                            {new Date(note.createdAt).toLocaleDateString()}
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickyNotes;
