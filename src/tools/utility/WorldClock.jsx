import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Globe } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const timezones = [
    { id: 'local', name: 'Local Time', offset: null },
    { id: 'UTC', name: 'UTC', offset: 0 },
    { id: 'America/New_York', name: 'New York', offset: -5 },
    { id: 'America/Los_Angeles', name: 'Los Angeles', offset: -8 },
    { id: 'America/Chicago', name: 'Chicago', offset: -6 },
    { id: 'Europe/London', name: 'London', offset: 0 },
    { id: 'Europe/Paris', name: 'Paris', offset: 1 },
    { id: 'Europe/Berlin', name: 'Berlin', offset: 1 },
    { id: 'Europe/Moscow', name: 'Moscow', offset: 3 },
    { id: 'Asia/Dubai', name: 'Dubai', offset: 4 },
    { id: 'Asia/Kolkata', name: 'India (IST)', offset: 5.5 },
    { id: 'Asia/Dhaka', name: 'Bangladesh', offset: 6 },
    { id: 'Asia/Bangkok', name: 'Bangkok', offset: 7 },
    { id: 'Asia/Singapore', name: 'Singapore', offset: 8 },
    { id: 'Asia/Hong_Kong', name: 'Hong Kong', offset: 8 },
    { id: 'Asia/Shanghai', name: 'Shanghai', offset: 8 },
    { id: 'Asia/Tokyo', name: 'Tokyo', offset: 9 },
    { id: 'Asia/Seoul', name: 'Seoul', offset: 9 },
    { id: 'Australia/Sydney', name: 'Sydney', offset: 11 },
    { id: 'Pacific/Auckland', name: 'Auckland', offset: 13 }
];

const WorldClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimezones, setSelectedTimezones] = useState(['local', 'UTC', 'America/New_York', 'Asia/Kolkata']);
    const { toast } = useToast();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const getTimeForTimezone = (tz) => {
        if (tz.offset === null) {
            return currentTime;
        }
        const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
        return new Date(utc + tz.offset * 3600000);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const addTimezone = (id) => {
        if (!selectedTimezones.includes(id)) {
            setSelectedTimezones([...selectedTimezones, id]);
            toast.success('Timezone added');
        }
    };

    const removeTimezone = (id) => {
        if (selectedTimezones.length > 1) {
            setSelectedTimezones(selectedTimezones.filter(t => t !== id));
        }
    };

    const getClockAngle = (date) => {
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return {
            hour: (hours * 30) + (minutes * 0.5),
            minute: minutes * 6,
            second: seconds * 6
        };
    };

    const availableTimezones = timezones.filter(tz => !selectedTimezones.includes(tz.id));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedTimezones.map(tzId => {
                    const tz = timezones.find(t => t.id === tzId);
                    if (!tz) return null;
                    const time = getTimeForTimezone(tz);
                    const angles = getClockAngle(time);

                    return (
                        <div key={tzId} className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-blue-400" />
                                    <span className="font-medium text-sm">{tz.name}</span>
                                </div>
                                {selectedTimezones.length > 1 && (
                                    <button
                                        onClick={() => removeTimezone(tzId)}
                                        className="p-1 hover:bg-red-500/20 rounded text-red-400"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-center mb-3">
                                <div className="relative w-24 h-24 rounded-full border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                                    {/* Hour markers */}
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-2 bg-[var(--text-muted)]"
                                            style={{
                                                left: '50%',
                                                top: '4px',
                                                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                                                transformOrigin: '50% 44px'
                                            }}
                                        />
                                    ))}
                                    {/* Hour hand */}
                                    <div
                                        className="absolute w-1 h-6 bg-white rounded-full"
                                        style={{
                                            left: '50%',
                                            bottom: '50%',
                                            transform: `translateX(-50%) rotate(${angles.hour}deg)`,
                                            transformOrigin: '50% 100%'
                                        }}
                                    />
                                    {/* Minute hand */}
                                    <div
                                        className="absolute w-0.5 h-8 bg-blue-400 rounded-full"
                                        style={{
                                            left: '50%',
                                            bottom: '50%',
                                            transform: `translateX(-50%) rotate(${angles.minute}deg)`,
                                            transformOrigin: '50% 100%'
                                        }}
                                    />
                                    {/* Second hand */}
                                    <div
                                        className="absolute w-0.5 h-9 bg-red-400 rounded-full"
                                        style={{
                                            left: '50%',
                                            bottom: '50%',
                                            transform: `translateX(-50%) rotate(${angles.second}deg)`,
                                            transformOrigin: '50% 100%'
                                        }}
                                    />
                                    {/* Center dot */}
                                    <div className="absolute w-2 h-2 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-2xl font-mono font-bold">{formatTime(time)}</p>
                                <p className="text-sm text-[var(--text-muted)]">{formatDate(time)}</p>
                                {tz.offset !== null && (
                                    <p className="text-xs text-[var(--text-muted)] mt-1">
                                        UTC{tz.offset >= 0 ? '+' : ''}{tz.offset}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {availableTimezones.length > 0 && (
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Add Timezone
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availableTimezones.slice(0, 6).map(tz => (
                            <button
                                key={tz.id}
                                onClick={() => addTimezone(tz.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                                <Plus size={14} />
                                {tz.name}
                            </button>
                        ))}
                        {availableTimezones.length > 6 && (
                            <select
                                onChange={(e) => {
                                    if (e.target.value) {
                                        addTimezone(e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                                className="input-field !py-1.5 !w-auto"
                            >
                                <option value="">More...</option>
                                {availableTimezones.slice(6).map(tz => (
                                    <option key={tz.id} value={tz.id}>{tz.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorldClock;
