import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Plus, Trash2, RotateCcw, Calendar, Target } from 'lucide-react';

const HabitTracker = () => {
    const [habits, setHabits] = useState([]);
    const [newHabit, setNewHabit] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const saved = localStorage.getItem('habitTracker');
        if (saved) {
            setHabits(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('habitTracker', JSON.stringify(habits));
    }, [habits]);

    const addHabit = () => {
        if (!newHabit.trim()) return;

        setHabits([...habits, {
            id: Date.now(),
            name: newHabit,
            completedDates: [],
            createdAt: new Date().toISOString()
        }]);
        setNewHabit('');
    };

    const toggleHabit = (habitId, date) => {
        setHabits(habits.map(habit => {
            if (habit.id === habitId) {
                const completedDates = habit.completedDates.includes(date)
                    ? habit.completedDates.filter(d => d !== date)
                    : [...habit.completedDates, date];
                return { ...habit, completedDates };
            }
            return habit;
        }));
    };

    const deleteHabit = (habitId) => {
        setHabits(habits.filter(h => h.id !== habitId));
    };

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split('T')[0],
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                dayNum: date.getDate()
            });
        }
        return days;
    };

    const getStreak = (habit) => {
        let streak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            if (habit.completedDates.includes(dateStr)) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }
        return streak;
    };

    const days = getLast7Days();

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Habit Tracker</h2>
                <p className="text-[var(--text-muted)] text-sm">Build good habits day by day</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newHabit}
                        onChange={(e) => setNewHabit(e.target.value)}
                        placeholder="Add a new habit..."
                        className="input flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addHabit}
                        className="btn-primary px-4"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                {habits.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No habits yet. Add one above!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Days Header */}
                        <div className="flex items-center gap-2">
                            <div className="w-32 sm:w-48"></div>
                            {days.map(day => (
                                <div key={day.date} className="flex-1 text-center">
                                    <p className="text-xs text-[var(--text-muted)]">{day.day}</p>
                                    <p className="text-sm font-medium">{day.dayNum}</p>
                                </div>
                            ))}
                            <div className="w-16 text-center text-xs text-[var(--text-muted)]">Streak</div>
                        </div>

                        {/* Habits */}
                        {habits.map(habit => (
                            <motion.div
                                key={habit.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 p-3 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <div className="w-32 sm:w-48 flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => deleteHabit(habit.id)}
                                        className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                    <span className="text-sm truncate">{habit.name}</span>
                                </div>

                                {days.map(day => {
                                    const isCompleted = habit.completedDates.includes(day.date);
                                    return (
                                        <motion.button
                                            key={day.date}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleHabit(habit.id, day.date)}
                                            className="flex-1 flex justify-center"
                                        >
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-[var(--text-muted)]" />
                                            )}
                                        </motion.button>
                                    );
                                })}

                                <div className="w-16 text-center">
                                    <span className={`text-sm font-bold ${getStreak(habit) > 0 ? 'text-orange-500' : 'text-[var(--text-muted)]'}`}>
                                        🔥 {getStreak(habit)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {habits.length > 0 && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-400">{habits.length}</p>
                                <p className="text-xs text-[var(--text-muted)]">Total Habits</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-400">
                                    {habits.filter(h => h.completedDates.includes(new Date().toISOString().split('T')[0])).length}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Done Today</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-400">
                                    {Math.max(...habits.map(h => getStreak(h)), 0)}
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">Best Streak</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitTracker;
