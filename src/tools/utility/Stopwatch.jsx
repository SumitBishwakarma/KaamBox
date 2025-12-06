import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 10);
            }, 10);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const startStop = () => {
        setIsRunning(!isRunning);
    };

    const reset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const lap = () => {
        if (isRunning && time > 0) {
            const prevLapTime = laps.length > 0 ? laps[0].total : 0;
            setLaps(prev => [{
                number: prev.length + 1,
                lap: time - prevLapTime,
                total: time
            }, ...prev]);
        }
    };

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);

        return {
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            centiseconds: centiseconds.toString().padStart(2, '0')
        };
    };

    const formatted = formatTime(time);

    // Find best and worst laps
    const lapTimes = laps.map(l => l.lap);
    const bestLap = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
    const worstLap = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

    return (
        <div className="max-w-lg mx-auto space-y-8">
            {/* Timer Display */}
            <div className="text-center py-12">
                <div className="font-mono text-7xl sm:text-8xl font-light tracking-tight text-[var(--text-primary)]">
                    <span>{formatted.minutes}</span>
                    <span className="text-[var(--text-muted)]">:</span>
                    <span>{formatted.seconds}</span>
                    <span className="text-[var(--text-muted)]">.</span>
                    <span className="text-4xl sm:text-5xl">{formatted.centiseconds}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
                {/* Reset / Lap */}
                <button
                    onClick={time > 0 && !isRunning ? reset : lap}
                    disabled={!isRunning && time === 0}
                    className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-all flex items-center justify-center disabled:opacity-50"
                >
                    {!isRunning && time > 0 ? (
                        <RotateCcw size={28} />
                    ) : (
                        <Flag size={28} />
                    )}
                </button>

                {/* Start/Stop */}
                <button
                    onClick={startStop}
                    className={`w-24 h-24 rounded-full transition-all flex items-center justify-center ${isRunning
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                >
                    {isRunning ? (
                        <Pause size={32} className="text-white" />
                    ) : (
                        <Play size={32} className="text-white ml-1" />
                    )}
                </button>

                {/* Placeholder for symmetry */}
                <div className="w-20 h-20" />
            </div>

            {/* Laps */}
            {laps.length > 0 && (
                <div className="bg-[var(--bg-tertiary)] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-4 border-b border-[var(--border-color)] text-sm font-medium text-[var(--text-muted)]">
                        <span>Lap</span>
                        <span className="text-center">Lap Time</span>
                        <span className="text-right">Total Time</span>
                    </div>
                    <div className="max-h-64 overflow-auto">
                        {laps.map((lapItem) => {
                            const lapTime = formatTime(lapItem.lap);
                            const totalTime = formatTime(lapItem.total);
                            const isBest = lapItem.lap === bestLap;
                            const isWorst = lapItem.lap === worstLap;

                            return (
                                <div
                                    key={lapItem.number}
                                    className={`grid grid-cols-3 gap-4 p-4 border-b border-[var(--border-color)] last:border-0 ${isBest ? 'bg-green-500/10' : isWorst ? 'bg-red-500/10' : ''
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        Lap {lapItem.number}
                                        {isBest && <span className="text-xs text-green-500">Best</span>}
                                        {isWorst && <span className="text-xs text-red-500">Worst</span>}
                                    </span>
                                    <span className={`text-center font-mono ${isBest ? 'text-green-500' : isWorst ? 'text-red-500' : ''
                                        }`}>
                                        {lapTime.minutes}:{lapTime.seconds}.{lapTime.centiseconds}
                                    </span>
                                    <span className="text-right font-mono text-[var(--text-muted)]">
                                        {totalTime.minutes}:{totalTime.seconds}.{totalTime.centiseconds}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Instructions */}
            {laps.length === 0 && (
                <p className="text-center text-sm text-[var(--text-muted)]">
                    Press the flag button while running to record laps
                </p>
            )}
        </div>
    );
};

export default Stopwatch;
