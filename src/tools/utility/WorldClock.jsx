import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Plus, Trash2, RefreshCw } from 'lucide-react';

const WorldClock = () => {
    const [clocks, setClocks] = useState([
        { id: 1, timezone: 'America/New_York', name: 'New York' },
        { id: 2, timezone: 'Europe/London', name: 'London' },
        { id: 3, timezone: 'Asia/Tokyo', name: 'Tokyo' }
    ]);
    const [now, setNow] = useState(new Date());
    const [showAdd, setShowAdd] = useState(false);

    const timezones = [
        { id: 'America/New_York', name: 'New York' },
        { id: 'America/Los_Angeles', name: 'Los Angeles' },
        { id: 'America/Chicago', name: 'Chicago' },
        { id: 'Europe/London', name: 'London' },
        { id: 'Europe/Paris', name: 'Paris' },
        { id: 'Europe/Berlin', name: 'Berlin' },
        { id: 'Europe/Moscow', name: 'Moscow' },
        { id: 'Asia/Tokyo', name: 'Tokyo' },
        { id: 'Asia/Shanghai', name: 'Shanghai' },
        { id: 'Asia/Kolkata', name: 'Mumbai' },
        { id: 'Asia/Dubai', name: 'Dubai' },
        { id: 'Asia/Singapore', name: 'Singapore' },
        { id: 'Asia/Hong_Kong', name: 'Hong Kong' },
        { id: 'Asia/Seoul', name: 'Seoul' },
        { id: 'Australia/Sydney', name: 'Sydney' },
        { id: 'Pacific/Auckland', name: 'Auckland' },
        { id: 'Asia/Dhaka', name: 'Dhaka' },
        { id: 'Africa/Cairo', name: 'Cairo' }
    ];

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('worldClocks', JSON.stringify(clocks));
    }, [clocks]);

    useEffect(() => {
        const saved = localStorage.getItem('worldClocks');
        if (saved) setClocks(JSON.parse(saved));
    }, []);

    const getTimeInZone = (timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);
    };

    const getDateInZone = (timezone) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(now);
    };

    const getOffset = (timezone) => {
        const formatter = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            timeZoneName: 'shortOffset'
        });
        const parts = formatter.formatToParts(now);
        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        return offsetPart?.value || '';
    };

    const addClock = (tz) => {
        if (clocks.find(c => c.timezone === tz.id)) return;
        setClocks([...clocks, { id: Date.now(), timezone: tz.id, name: tz.name }]);
        setShowAdd(false);
    };

    const removeClock = (id) => {
        setClocks(clocks.filter(c => c.id !== id));
    };

    const isNight = (timezone) => {
        const hour = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            hour12: false
        }).format(now));
        return hour >= 20 || hour < 6;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">World Clock</h2>
                <p className="text-[var(--text-muted)] text-sm">Track time across the globe</p>
            </div>

            <div className="space-y-4">
                {/* Local Time */}
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center">
                    <p className="text-sm text-[var(--text-muted)]">Your Local Time</p>
                    <p className="text-4xl font-mono font-bold mt-2">
                        {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* World Clocks */}
                <div className="grid gap-3">
                    {clocks.map(clock => (
                        <motion.div
                            key={clock.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 rounded-xl flex items-center justify-between ${isNight(clock.timezone)
                                    ? 'bg-gradient-to-r from-slate-800/50 to-slate-900/50'
                                    : 'bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    {isNight(clock.timezone) ? '🌙' : '☀️'}
                                </div>
                                <div>
                                    <p className="font-medium">{clock.name}</p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {getDateInZone(clock.timezone)} • {getOffset(clock.timezone)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-xl font-mono font-bold">
                                    {getTimeInZone(clock.timezone)}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removeClock(clock.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Clock */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAdd(!showAdd)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add City
                </motion.button>

                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto"
                    >
                        {timezones.filter(tz => !clocks.find(c => c.timezone === tz.id)).map(tz => (
                            <button
                                key={tz.id}
                                onClick={() => addClock(tz)}
                                className="p-2 text-sm bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                {tz.name}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WorldClock;
