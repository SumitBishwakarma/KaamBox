import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Timer, Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react';

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
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = () => {
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };

    const addLap = () => {
        const lapTime = laps.length > 0 ? time - laps.reduce((a, b) => a + b, 0) : time;
        setLaps([...laps, lapTime]);
    };

    const getBestLap = () => laps.length > 0 ? Math.min(...laps) : null;
    const getWorstLap = () => laps.length > 0 ? Math.max(...laps) : null;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Stopwatch</h2>
                <p className="text-[var(--text-muted)] text-sm">Precise timing with lap tracking</p>
            </div>

            <div className="space-y-4">
                {/* Timer Display */}
                <div className="p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl text-center">
                    <motion.p
                        className="text-6xl font-mono font-bold"
                        animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 0.5, repeat: isRunning ? Infinity : 0 }}
                    >
                        {formatTime(time)}
                    </motion.p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    {!isRunning ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={start}
                            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
                        >
                            <Play className="w-8 h-8 text-white ml-1" />
                        </motion.button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={pause}
                            className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center"
                        >
                            <Pause className="w-8 h-8 text-white" />
                        </motion.button>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addLap}
                        disabled={!isRunning && time === 0}
                        className="w-16 h-16 rounded-full bg-[var(--accent-primary)] flex items-center justify-center disabled:opacity-50"
                    >
                        <Flag className="w-7 h-7 text-white" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={reset}
                        className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                    >
                        <RotateCcw className="w-7 h-7 text-white" />
                    </motion.button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-medium">Laps ({laps.length})</p>
                            <button
                                onClick={() => setLaps([])}
                                className="text-red-400 text-xs flex items-center gap-1"
                            >
                                <Trash2 className="w-3 h-3" /> Clear
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-2">
                            {laps.map((lap, i) => {
                                const isBest = lap === getBestLap();
                                const isWorst = lap === getWorstLap() && laps.length > 1;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex justify-between items-center p-2 rounded-lg ${isBest ? 'bg-green-500/20' : isWorst ? 'bg-red-500/20' : 'bg-[var(--bg-secondary)]'
                                            }`}
                                    >
                                        <span className="text-sm">
                                            Lap {i + 1}
                                            {isBest && <span className="ml-2 text-xs text-green-500">Best</span>}
                                            {isWorst && <span className="ml-2 text-xs text-red-500">Slowest</span>}
                                        </span>
                                        <span className={`font-mono ${isBest ? 'text-green-500' : isWorst ? 'text-red-500' : ''}`}>
                                            {formatTime(lap)}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--bg-secondary)] flex justify-between text-sm">
                            <span className="text-[var(--text-muted)]">Total</span>
                            <span className="font-mono font-bold">{formatTime(time)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stopwatch;
