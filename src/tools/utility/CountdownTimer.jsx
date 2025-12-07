import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';

const CountdownTimer = () => {
    const [countdowns, setCountdowns] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('12:00');
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem('countdowns');
        if (saved) {
            setCountdowns(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        // Save to localStorage
        localStorage.setItem('countdowns', JSON.stringify(countdowns));
    }, [countdowns]);

    const addCountdown = () => {
        if (!newName || !newDate) return;

        const dateTime = new Date(`${newDate}T${newTime}`);
        const newCountdown = {
            id: Date.now(),
            name: newName,
            targetDate: dateTime.toISOString()
        };

        setCountdowns([...countdowns, newCountdown]);
        setNewName('');
        setNewDate('');
    };

    const removeCountdown = (id) => {
        setCountdowns(countdowns.filter(c => c.id !== id));
    };

    const calculateTimeLeft = (targetDate) => {
        const target = new Date(targetDate);
        const diff = target - now;

        if (diff <= 0) {
            return { expired: true };
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, expired: false };
    };

    const presetEvents = [
        { name: 'New Year 2025', date: '2025-01-01', time: '00:00' },
        { name: 'Christmas 2024', date: '2024-12-25', time: '00:00' },
        { name: 'Valentine\'s Day', date: '2025-02-14', time: '00:00' }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Countdown Timer</h2>
                <p className="text-[var(--text-muted)] text-sm">Track time until important events</p>
            </div>

            <div className="space-y-4">
                {/* Add New Countdown */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl space-y-3">
                    <p className="text-sm font-medium">Add New Countdown</p>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Event name..."
                        className="input w-full"
                    />
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="input flex-1"
                        />
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="input w-28"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addCountdown}
                        className="btn-primary w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Countdown
                    </motion.button>
                </div>

                {/* Quick Add Presets */}
                <div>
                    <p className="text-sm text-[var(--text-muted)] mb-2">Quick Add:</p>
                    <div className="flex flex-wrap gap-2">
                        {presetEvents.map(event => (
                            <button
                                key={event.name}
                                onClick={() => {
                                    setNewName(event.name);
                                    setNewDate(event.date);
                                    setNewTime(event.time);
                                }}
                                className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                {event.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Countdowns */}
                {countdowns.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No countdowns yet. Add one above!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {countdowns.map(countdown => {
                            const timeLeft = calculateTimeLeft(countdown.targetDate);
                            return (
                                <motion.div
                                    key={countdown.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl ${timeLeft.expired
                                            ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20'
                                            : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium">{countdown.name}</h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => removeCountdown(countdown.id)}
                                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>

                                    {timeLeft.expired ? (
                                        <div className="text-center py-4">
                                            <p className="text-2xl font-bold text-red-400">🎉 Event Happened!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                                <p className="text-2xl font-bold text-blue-400">{timeLeft.days}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Days</p>
                                            </div>
                                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                                <p className="text-2xl font-bold text-purple-400">{timeLeft.hours}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Hours</p>
                                            </div>
                                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                                <p className="text-2xl font-bold text-green-400">{timeLeft.minutes}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Mins</p>
                                            </div>
                                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                                <p className="text-2xl font-bold text-orange-400">{timeLeft.seconds}</p>
                                                <p className="text-xs text-[var(--text-muted)]">Secs</p>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-xs text-[var(--text-muted)] mt-2 text-center">
                                        {new Date(countdown.targetDate).toLocaleString()}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountdownTimer;
