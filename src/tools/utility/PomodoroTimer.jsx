import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PomodoroTimer = () => {
    const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        workTime: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsBeforeLong: 4
    });
    const intervalRef = useRef(null);
    const { toast } = useToast();

    const modes = {
        work: {
            label: 'Focus Time',
            time: settings.workTime,
            color: 'from-red-500 to-orange-500',
            icon: Brain
        },
        shortBreak: {
            label: 'Short Break',
            time: settings.shortBreak,
            color: 'from-green-500 to-emerald-500',
            icon: Coffee
        },
        longBreak: {
            label: 'Long Break',
            time: settings.longBreak,
            color: 'from-blue-500 to-cyan-500',
            icon: Coffee
        }
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft]);

    const handleComplete = () => {
        setIsRunning(false);

        // Play notification sound (browser notification)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: mode === 'work' ? 'Time for a break!' : 'Back to work!',
                icon: '🍅'
            });
        }

        if (mode === 'work') {
            const newSessions = sessions + 1;
            setSessions(newSessions);
            toast.success('Great work! Time for a break.');

            // Check if it's time for a long break
            if (newSessions % settings.sessionsBeforeLong === 0) {
                setMode('longBreak');
                setTimeLeft(settings.longBreak * 60);
            } else {
                setMode('shortBreak');
                setTimeLeft(settings.shortBreak * 60);
            }
        } else {
            toast.info('Break over! Ready to focus?');
            setMode('work');
            setTimeLeft(settings.workTime * 60);
        }
    };

    const switchMode = (newMode) => {
        setIsRunning(false);
        setMode(newMode);
        setTimeLeft(modes[newMode].time * 60);
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(modes[mode].time * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((modes[mode].time * 60 - timeLeft) / (modes[mode].time * 60)) * 100;
    const CurrentIcon = modes[mode].icon;

    return (
        <div className="max-w-md mx-auto space-y-8">
            {/* Mode Selector */}
            <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                {Object.entries(modes).map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => switchMode(key)}
                        className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all ${mode === key
                                ? `bg-gradient-to-r ${modes[key].color} text-white`
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Timer Display */}
            <div className="relative">
                {/* Progress Ring */}
                <svg className="w-64 h-64 mx-auto transform -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="8"
                        fill="none"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                        className="transition-all duration-1000"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            {mode === 'work' && (
                                <>
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#f97316" />
                                </>
                            )}
                            {mode === 'shortBreak' && (
                                <>
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </>
                            )}
                            {mode === 'longBreak' && (
                                <>
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#06b6d4" />
                                </>
                            )}
                        </linearGradient>
                    </defs>
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <CurrentIcon size={28} className="text-[var(--text-muted)] mb-2" />
                    <span className="text-6xl font-light tracking-tight">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-[var(--text-muted)] mt-2">
                        {modes[mode].label}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={resetTimer}
                    className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center"
                >
                    <RotateCcw size={24} />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-full transition-all flex items-center justify-center bg-gradient-to-r ${modes[mode].color}`}
                >
                    {isRunning ? (
                        <Pause size={32} className="text-white" />
                    ) : (
                        <Play size={32} className="text-white ml-1" />
                    )}
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-14 h-14 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center"
                >
                    <Settings size={24} />
                </button>
            </div>

            {/* Session Counter */}
            <div className="text-center">
                <p className="text-sm text-[var(--text-muted)]">Sessions completed</p>
                <div className="flex justify-center gap-2 mt-2">
                    {Array.from({ length: settings.sessionsBeforeLong }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full transition-colors ${i < (sessions % settings.sessionsBeforeLong)
                                    ? 'bg-green-500'
                                    : 'bg-[var(--bg-tertiary)]'
                                }`}
                        />
                    ))}
                </div>
                <p className="text-lg font-bold mt-2">{sessions} total</p>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-6 space-y-4">
                    <h3 className="font-medium text-[var(--text-primary)]">Settings</h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-1">
                                Focus (min)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={settings.workTime}
                                onChange={(e) => setSettings({ ...settings, workTime: parseInt(e.target.value) || 25 })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-1">
                                Short Break (min)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={settings.shortBreak}
                                onChange={(e) => setSettings({ ...settings, shortBreak: parseInt(e.target.value) || 5 })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-1">
                                Long Break (min)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={settings.longBreak}
                                onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--text-muted)] mb-1">
                                Sessions before long
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={settings.sessionsBeforeLong}
                                onChange={(e) => setSettings({ ...settings, sessionsBeforeLong: parseInt(e.target.value) || 4 })}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setShowSettings(false);
                            setTimeLeft(modes[mode].time * 60);
                        }}
                        className="btn-primary w-full"
                    >
                        Apply & Reset Timer
                    </button>
                </div>
            )}
        </div>
    );
};

export default PomodoroTimer;
