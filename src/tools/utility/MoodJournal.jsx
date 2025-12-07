import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Meh, Heart, Calendar, Trash2, BarChart3 } from 'lucide-react';

const MoodJournal = () => {
    const [entries, setEntries] = useState([]);
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    const moods = [
        { id: 'great', emoji: '😄', label: 'Great', color: '#22c55e' },
        { id: 'good', emoji: '🙂', label: 'Good', color: '#84cc16' },
        { id: 'okay', emoji: '😐', label: 'Okay', color: '#eab308' },
        { id: 'bad', emoji: '😔', label: 'Bad', color: '#f97316' },
        { id: 'awful', emoji: '😢', label: 'Awful', color: '#ef4444' }
    ];

    useEffect(() => {
        const saved = localStorage.getItem('moodJournal');
        if (saved) setEntries(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem('moodJournal', JSON.stringify(entries));
    }, [entries]);

    const addEntry = () => {
        if (!selectedMood) return;

        const newEntry = {
            id: Date.now(),
            mood: selectedMood,
            note,
            date: new Date().toISOString()
        };

        setEntries([newEntry, ...entries]);
        setSelectedMood(null);
        setNote('');
    };

    const deleteEntry = (id) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const todayEntry = entries.find(e =>
        new Date(e.date).toDateString() === new Date().toDateString()
    );

    const getLast7DaysMoods = () => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
            last7Days.push({
                date: date.toLocaleDateString('en', { weekday: 'short' }),
                mood: entry ? moods.find(m => m.id === entry.mood) : null
            });
        }
        return last7Days;
    };

    const getMoodStats = () => {
        const stats = {};
        moods.forEach(m => stats[m.id] = 0);
        entries.slice(0, 30).forEach(e => stats[e.mood]++);
        return stats;
    };

    const stats = getMoodStats();
    const totalEntries = entries.slice(0, 30).length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Mood Journal</h2>
                <p className="text-[var(--text-muted)] text-sm">Track your daily mood and feelings</p>
            </div>

            <div className="space-y-4">
                {!todayEntry ? (
                    <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
                        <p className="text-center mb-4">How are you feeling today?</p>

                        <div className="flex justify-center gap-3 mb-4">
                            {moods.map(mood => (
                                <motion.button
                                    key={mood.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedMood(mood.id)}
                                    className={`w-14 h-14 rounded-2xl text-3xl flex items-center justify-center transition-all ${selectedMood === mood.id
                                            ? 'ring-2 ring-white scale-110'
                                            : 'opacity-70'
                                        }`}
                                    style={{ backgroundColor: mood.color + '30' }}
                                >
                                    {mood.emoji}
                                </motion.button>
                            ))}
                        </div>

                        {selectedMood && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note (optional)..."
                                    className="input w-full h-20 resize-none mb-3"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={addEntry}
                                    className="btn-primary w-full"
                                >
                                    Save Today's Mood
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl text-center">
                        <p className="text-sm text-[var(--text-muted)] mb-2">Today's Mood</p>
                        <span className="text-5xl">{moods.find(m => m.id === todayEntry.mood)?.emoji}</span>
                        <p className="mt-2 font-medium">{moods.find(m => m.id === todayEntry.mood)?.label}</p>
                        {todayEntry.note && (
                            <p className="mt-2 text-sm text-[var(--text-muted)]">"{todayEntry.note}"</p>
                        )}
                    </div>
                )}

                {/* Last 7 Days */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-3">Last 7 Days</p>
                    <div className="flex justify-between">
                        {getLast7DaysMoods().map((day, i) => (
                            <div key={i} className="text-center">
                                <p className="text-xs text-[var(--text-muted)]">{day.date}</p>
                                <div className="w-10 h-10 flex items-center justify-center text-xl">
                                    {day.mood ? day.mood.emoji : '—'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                {totalEntries > 0 && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Mood Distribution (Last 30 days)
                        </p>
                        <div className="space-y-2">
                            {moods.map(mood => {
                                const percentage = totalEntries > 0 ? (stats[mood.id] / totalEntries) * 100 : 0;
                                return (
                                    <div key={mood.id} className="flex items-center gap-2">
                                        <span className="w-8 text-center">{mood.emoji}</span>
                                        <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-4 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: mood.color }}
                                            />
                                        </div>
                                        <span className="w-8 text-xs text-right">{stats[mood.id]}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* History Toggle */}
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full p-3 bg-[var(--bg-tertiary)] rounded-xl text-sm flex items-center justify-center gap-2"
                >
                    <Calendar className="w-4 h-4" />
                    {showHistory ? 'Hide History' : 'Show History'}
                </button>

                {/* History */}
                {showHistory && entries.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {entries.slice(0, 30).map(entry => {
                            const mood = moods.find(m => m.id === entry.mood);
                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-xl"
                                >
                                    <span className="text-2xl">{mood?.emoji}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{mood?.label}</p>
                                        <p className="text-xs text-[var(--text-muted)]">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </p>
                                        {entry.note && (
                                            <p className="text-xs text-[var(--text-muted)] mt-1">"{entry.note}"</p>
                                        )}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteEntry(entry.id)}
                                        className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodJournal;
