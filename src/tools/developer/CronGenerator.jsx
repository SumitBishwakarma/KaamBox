import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Copy, Check, Download } from 'lucide-react';

const CronGenerator = () => {
    const [minute, setMinute] = useState('*');
    const [hour, setHour] = useState('*');
    const [dayOfMonth, setDayOfMonth] = useState('*');
    const [month, setMonth] = useState('*');
    const [dayOfWeek, setDayOfWeek] = useState('*');
    const [copied, setCopied] = useState(false);

    const presets = [
        { name: 'Every minute', cron: '* * * * *' },
        { name: 'Every 5 minutes', cron: '*/5 * * * *' },
        { name: 'Every hour', cron: '0 * * * *' },
        { name: 'Every day at midnight', cron: '0 0 * * *' },
        { name: 'Every day at noon', cron: '0 12 * * *' },
        { name: 'Every Monday', cron: '0 0 * * 1' },
        { name: 'Every weekday', cron: '0 0 * * 1-5' },
        { name: 'Every weekend', cron: '0 0 * * 0,6' },
        { name: 'First of month', cron: '0 0 1 * *' },
        { name: 'Every 15 minutes', cron: '*/15 * * * *' }
    ];

    const getCronExpression = () => `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

    const parseCron = (cron) => {
        const parts = cron.split(' ');
        if (parts.length === 5) {
            setMinute(parts[0]);
            setHour(parts[1]);
            setDayOfMonth(parts[2]);
            setMonth(parts[3]);
            setDayOfWeek(parts[4]);
        }
    };

    const getDescription = () => {
        const cron = getCronExpression();

        if (cron === '* * * * *') return 'Every minute';
        if (cron === '*/5 * * * *') return 'Every 5 minutes';
        if (cron === '0 * * * *') return 'Every hour at minute 0';
        if (cron === '0 0 * * *') return 'Every day at midnight';
        if (cron === '0 12 * * *') return 'Every day at noon';
        if (cron.match(/^0 0 \* \* [0-6]$/)) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return `Every ${days[parseInt(dayOfWeek)]} at midnight`;
        }

        let desc = [];
        if (minute !== '*') desc.push(`minute ${minute}`);
        if (hour !== '*') desc.push(`hour ${hour}`);
        if (dayOfMonth !== '*') desc.push(`day ${dayOfMonth}`);
        if (month !== '*') desc.push(`month ${month}`);
        if (dayOfWeek !== '*') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            if (dayOfWeek.includes('-')) {
                const [start, end] = dayOfWeek.split('-').map(Number);
                desc.push(`${days[start]}-${days[end]}`);
            } else {
                desc.push(days[parseInt(dayOfWeek)] || dayOfWeek);
            }
        }

        return desc.length > 0 ? `At ${desc.join(', ')}` : 'Custom schedule';
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getCronExpression());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Cron Expression Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Build cron expressions for scheduled tasks</p>
            </div>

            <div className="space-y-4">
                {/* Result */}
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center">
                    <p className="text-3xl font-mono font-bold mb-2">{getCronExpression()}</p>
                    <p className="text-sm text-[var(--text-muted)]">{getDescription()}</p>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-5 gap-2">
                    <div className="text-center">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Minute</label>
                        <input
                            type="text"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className="input w-full text-center font-mono"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">0-59</p>
                    </div>
                    <div className="text-center">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Hour</label>
                        <input
                            type="text"
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                            className="input w-full text-center font-mono"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">0-23</p>
                    </div>
                    <div className="text-center">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Day</label>
                        <input
                            type="text"
                            value={dayOfMonth}
                            onChange={(e) => setDayOfMonth(e.target.value)}
                            className="input w-full text-center font-mono"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">1-31</p>
                    </div>
                    <div className="text-center">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Month</label>
                        <input
                            type="text"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="input w-full text-center font-mono"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">1-12</p>
                    </div>
                    <div className="text-center">
                        <label className="block text-xs text-[var(--text-muted)] mb-1">Weekday</label>
                        <input
                            type="text"
                            value={dayOfWeek}
                            onChange={(e) => setDayOfWeek(e.target.value)}
                            className="input w-full text-center font-mono"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">0-6</p>
                    </div>
                </div>

                {/* Copy Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyToClipboard}
                    className="btn-primary w-full"
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Expression'}
                </motion.button>

                {/* Presets */}
                <div>
                    <p className="text-sm font-medium mb-2">Common Presets</p>
                    <div className="grid grid-cols-2 gap-2">
                        {presets.map(p => (
                            <button
                                key={p.name}
                                onClick={() => parseCron(p.cron)}
                                className="p-2 text-left text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <p className="font-medium">{p.name}</p>
                                <p className="text-[var(--text-muted)] font-mono">{p.cron}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Syntax Guide */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-2">Syntax Guide</p>
                    <div className="text-xs text-[var(--text-muted)] space-y-1">
                        <p><code className="bg-[var(--bg-secondary)] px-1 rounded">*</code> = any value</p>
                        <p><code className="bg-[var(--bg-secondary)] px-1 rounded">*/5</code> = every 5 units</p>
                        <p><code className="bg-[var(--bg-secondary)] px-1 rounded">1,15</code> = specific values</p>
                        <p><code className="bg-[var(--bg-secondary)] px-1 rounded">1-5</code> = range</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CronGenerator;
