import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Trash2, Target, TrendingUp } from 'lucide-react';

const WaterIntakeTracker = () => {
    const [dailyGoal, setDailyGoal] = useState(8);
    const [glasses, setGlasses] = useState(0);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('waterTracker');
        if (saved) {
            const data = JSON.parse(saved);
            setDailyGoal(data.dailyGoal || 8);
            setHistory(data.history || []);

            // Check if today's entry exists
            const today = new Date().toDateString();
            const todayEntry = data.history?.find(h => h.date === today);
            if (todayEntry) {
                setGlasses(todayEntry.glasses);
            } else {
                setGlasses(0);
            }
        }
    }, []);

    useEffect(() => {
        const today = new Date().toDateString();
        const updatedHistory = history.filter(h => h.date !== today);
        if (glasses > 0) {
            updatedHistory.push({ date: today, glasses });
        }

        localStorage.setItem('waterTracker', JSON.stringify({
            dailyGoal,
            history: updatedHistory
        }));
    }, [glasses, dailyGoal, history]);

    const addGlass = () => setGlasses(prev => prev + 1);
    const removeGlass = () => setGlasses(prev => Math.max(0, prev - 1));

    const progress = Math.min((glasses / dailyGoal) * 100, 100);
    const goalReached = glasses >= dailyGoal;

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const entry = history.find(h => h.date === dateStr);
            days.push({
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                date: dateStr,
                glasses: entry?.glasses || 0
            });
        }
        return days;
    };

    const stats = getLast7Days();
    const weeklyAverage = stats.reduce((sum, d) => sum + d.glasses, 0) / 7;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Water Intake Tracker</h2>
                <p className="text-[var(--text-muted)] text-sm">Stay hydrated, track your water intake</p>
            </div>

            <div className="space-y-4">
                {/* Progress Circle */}
                <div className="relative w-48 h-48 mx-auto">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--bg-tertiary)"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={goalReached ? '#22c55e' : '#3b82f6'}
                            strokeWidth="8"
                            strokeLinecap="round"
                            initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
                            transition={{ duration: 0.5 }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Droplets className={`w-8 h-8 mb-1 ${goalReached ? 'text-green-500' : 'text-blue-500'}`} />
                        <p className="text-3xl font-bold">{glasses}</p>
                        <p className="text-sm text-[var(--text-muted)]">of {dailyGoal} glasses</p>
                    </div>
                </div>

                {goalReached && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-3 bg-green-500/20 rounded-xl"
                    >
                        <p className="text-green-500 font-medium">🎉 Goal Reached! Great job staying hydrated!</p>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={removeGlass}
                        className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-500 text-2xl font-bold flex items-center justify-center"
                    >
                        -
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={addGlass}
                        className="w-20 h-20 rounded-2xl bg-blue-500 text-white text-3xl font-bold flex items-center justify-center shadow-lg"
                    >
                        <Plus className="w-10 h-10" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setGlasses(0)}
                        className="w-14 h-14 rounded-2xl bg-[var(--bg-tertiary)] text-2xl font-bold flex items-center justify-center"
                    >
                        <Trash2 className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Daily Goal Setting */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <label className="flex items-center justify-between">
                        <span className="text-sm flex items-center gap-2">
                            <Target className="w-4 h-4" /> Daily Goal
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
                                className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] text-lg"
                            >
                                -
                            </button>
                            <span className="w-8 text-center font-bold">{dailyGoal}</span>
                            <button
                                onClick={() => setDailyGoal(dailyGoal + 1)}
                                className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] text-lg"
                            >
                                +
                            </button>
                            <span className="text-sm text-[var(--text-muted)]">glasses</span>
                        </div>
                    </label>
                </div>

                {/* Weekly History */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Last 7 Days
                    </p>
                    <div className="flex justify-between items-end h-32">
                        {stats.map((day, i) => {
                            const height = dailyGoal > 0 ? (day.glasses / dailyGoal) * 100 : 0;
                            const isToday = day.date === new Date().toDateString();
                            return (
                                <div key={i} className="flex flex-col items-center w-10">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(height, 100)}%` }}
                                        className={`w-6 rounded-t-lg ${height >= 100 ? 'bg-green-500' : isToday ? 'bg-blue-500' : 'bg-blue-500/50'
                                            }`}
                                        style={{ minHeight: day.glasses > 0 ? '8px' : '2px' }}
                                    />
                                    <p className="text-xs mt-2 text-[var(--text-muted)]">{day.day}</p>
                                    <p className="text-xs font-medium">{day.glasses}</p>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-center text-[var(--text-muted)] mt-2">
                        Weekly Average: {weeklyAverage.toFixed(1)} glasses/day
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WaterIntakeTracker;
