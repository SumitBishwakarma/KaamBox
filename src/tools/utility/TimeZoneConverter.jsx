import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Clock, Search, MapPin } from 'lucide-react';

const TimeZoneConverter = () => {
    const [sourceTime, setSourceTime] = useState('');
    const [sourceZone, setSourceZone] = useState('America/New_York');
    const [targetZone, setTargetZone] = useState('Asia/Kolkata');
    const [result, setResult] = useState(null);

    const timezones = [
        { id: 'America/New_York', name: 'New York (EST)', offset: '-5:00' },
        { id: 'America/Los_Angeles', name: 'Los Angeles (PST)', offset: '-8:00' },
        { id: 'America/Chicago', name: 'Chicago (CST)', offset: '-6:00' },
        { id: 'Europe/London', name: 'London (GMT)', offset: '+0:00' },
        { id: 'Europe/Paris', name: 'Paris (CET)', offset: '+1:00' },
        { id: 'Europe/Berlin', name: 'Berlin (CET)', offset: '+1:00' },
        { id: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: '+9:00' },
        { id: 'Asia/Shanghai', name: 'Shanghai (CST)', offset: '+8:00' },
        { id: 'Asia/Kolkata', name: 'India (IST)', offset: '+5:30' },
        { id: 'Asia/Dubai', name: 'Dubai (GST)', offset: '+4:00' },
        { id: 'Asia/Singapore', name: 'Singapore (SGT)', offset: '+8:00' },
        { id: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: '+8:00' },
        { id: 'Australia/Sydney', name: 'Sydney (AEST)', offset: '+11:00' },
        { id: 'Pacific/Auckland', name: 'Auckland (NZST)', offset: '+13:00' },
        { id: 'Asia/Dhaka', name: 'Dhaka (BST)', offset: '+6:00' },
        { id: 'Asia/Karachi', name: 'Karachi (PKT)', offset: '+5:00' }
    ];

    useEffect(() => {
        const now = new Date();
        setSourceTime(now.toTimeString().slice(0, 5));
    }, []);

    const convertTime = () => {
        if (!sourceTime) return;

        try {
            const today = new Date().toISOString().split('T')[0];
            const sourceDate = new Date(`${today}T${sourceTime}:00`);

            const sourceFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: sourceZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const targetFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: targetZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });

            // Calculate offset difference
            const sourceOffset = new Date(sourceDate.toLocaleString('en-US', { timeZone: sourceZone }));
            const targetOffset = new Date(sourceDate.toLocaleString('en-US', { timeZone: targetZone }));
            const diffHours = (targetOffset - sourceOffset) / (1000 * 60 * 60);

            setResult({
                sourceFormatted: sourceFormatter.format(sourceDate),
                targetFormatted: targetFormatter.format(sourceDate),
                diffHours
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        convertTime();
    }, [sourceTime, sourceZone, targetZone]);

    const swapZones = () => {
        const temp = sourceZone;
        setSourceZone(targetZone);
        setTargetZone(temp);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Time Zone Converter</h2>
                <p className="text-[var(--text-muted)] text-sm">Convert time between different time zones</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                        type="time"
                        value={sourceTime}
                        onChange={(e) => setSourceTime(e.target.value)}
                        className="input w-full text-2xl text-center"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">From Time Zone</label>
                        <select
                            value={sourceZone}
                            onChange={(e) => setSourceZone(e.target.value)}
                            className="input w-full"
                        >
                            {timezones.map(tz => (
                                <option key={tz.id} value={tz.id}>{tz.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={swapZones}
                            className="p-3 rounded-full bg-[var(--bg-tertiary)]"
                        >
                            ⇅
                        </motion.button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">To Time Zone</label>
                        <select
                            value={targetZone}
                            onChange={(e) => setTargetZone(e.target.value)}
                            className="input w-full"
                        >
                            {timezones.map(tz => (
                                <option key={tz.id} value={tz.id}>{tz.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"
                    >
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                                <p className="text-sm text-[var(--text-muted)] mb-1">
                                    {timezones.find(t => t.id === sourceZone)?.name}
                                </p>
                                <p className="text-2xl font-bold">{result.sourceFormatted}</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                                <p className="text-sm text-[var(--text-muted)] mb-1">
                                    {timezones.find(t => t.id === targetZone)?.name}
                                </p>
                                <p className="text-2xl font-bold text-[var(--accent-primary)]">{result.targetFormatted}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-2">Popular Conversions</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { from: 'America/New_York', to: 'Asia/Kolkata', label: 'NY → India' },
                            { from: 'Europe/London', to: 'America/New_York', label: 'London → NY' },
                            { from: 'Asia/Tokyo', to: 'America/Los_Angeles', label: 'Tokyo → LA' }
                        ].map(p => (
                            <button
                                key={p.label}
                                onClick={() => { setSourceZone(p.from); setTargetZone(p.to); }}
                                className="px-3 py-1.5 text-xs bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeZoneConverter;
