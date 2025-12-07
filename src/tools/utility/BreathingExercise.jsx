import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Wind, Play, Pause, RotateCcw, Settings } from 'lucide-react';

const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('ready');
    const [timeLeft, setTimeLeft] = useState(0);
    const [pattern, setPattern] = useState({ inhale: 4, hold: 4, exhale: 4 });
    const [showSettings, setShowSettings] = useState(false);
    const timerRef = useRef(null);

    const patterns = [
        { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4 },
        { name: '4-7-8 Relaxation', inhale: 4, hold: 7, exhale: 8 },
        { name: 'Energizing', inhale: 6, hold: 0, exhale: 2 },
        { name: 'Calm', inhale: 4, hold: 2, exhale: 6 }
    ];

    const phaseInfo = {
        ready: { text: 'Ready', color: 'from-blue-500/20 to-purple-500/20', scale: 1 },
        inhale: { text: 'Breathe In', color: 'from-green-500/30 to-blue-500/30', scale: 1.3 },
        hold: { text: 'Hold', color: 'from-purple-500/30 to-pink-500/30', scale: 1.3 },
        exhale: { text: 'Breathe Out', color: 'from-orange-500/30 to-red-500/30', scale: 1 }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const runCycle = () => {
        const totalCycle = pattern.inhale + pattern.hold + pattern.exhale;
        let elapsed = 0;

        const tick = () => {
            elapsed++;

            if (elapsed <= pattern.inhale) {
                setPhase('inhale');
                setTimeLeft(pattern.inhale - elapsed + 1);
            } else if (elapsed <= pattern.inhale + pattern.hold) {
                setPhase('hold');
                setTimeLeft(pattern.inhale + pattern.hold - elapsed + 1);
            } else if (elapsed <= totalCycle) {
                setPhase('exhale');
                setTimeLeft(totalCycle - elapsed + 1);
            } else {
                elapsed = 0;
            }
        };

        tick();
        timerRef.current = setInterval(tick, 1000);
    };

    const start = () => {
        setIsActive(true);
        runCycle();
    };

    const stop = () => {
        setIsActive(false);
        setPhase('ready');
        setTimeLeft(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const applyPattern = (p) => {
        setPattern(p);
        setShowSettings(false);
        if (isActive) {
            stop();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Breathing Exercise</h2>
                <p className="text-[var(--text-muted)] text-sm">Relax with guided breathing patterns</p>
            </div>

            <div className="space-y-4">
                {/* Main Circle */}
                <div className="flex justify-center py-8">
                    <motion.div
                        animate={{
                            scale: phaseInfo[phase].scale,
                            transition: {
                                duration: phase === 'inhale' ? pattern.inhale :
                                    phase === 'exhale' ? pattern.exhale : 0.3
                            }
                        }}
                        className={`w-48 h-48 rounded-full flex flex-col items-center justify-center bg-gradient-to-br ${phaseInfo[phase].color}`}
                    >
                        <Wind className="w-10 h-10 mb-2" />
                        <p className="text-2xl font-bold">{phaseInfo[phase].text}</p>
                        {timeLeft > 0 && (
                            <p className="text-4xl font-mono mt-2">{timeLeft}</p>
                        )}
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isActive ? stop : start}
                        className={`px-8 py-4 rounded-2xl font-medium flex items-center gap-2 ${isActive ? 'bg-red-500' : 'bg-[var(--accent-primary)]'
                            } text-white`}
                    >
                        {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        {isActive ? 'Stop' : 'Start'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-4 rounded-2xl bg-[var(--bg-tertiary)]"
                    >
                        <Settings className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Current Pattern */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-sm text-[var(--text-muted)] mb-2">Current Pattern</p>
                    <div className="flex justify-center gap-4">
                        <div>
                            <p className="text-2xl font-bold text-green-500">{pattern.inhale}s</p>
                            <p className="text-xs text-[var(--text-muted)]">Inhale</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-500">{pattern.hold}s</p>
                            <p className="text-xs text-[var(--text-muted)]">Hold</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-orange-500">{pattern.exhale}s</p>
                            <p className="text-xs text-[var(--text-muted)]">Exhale</p>
                        </div>
                    </div>
                </div>

                {/* Pattern Selection */}
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                    >
                        <p className="text-sm font-medium">Choose Pattern</p>
                        {patterns.map(p => (
                            <button
                                key={p.name}
                                onClick={() => applyPattern(p)}
                                className={`w-full p-3 rounded-xl text-left transition-colors ${pattern.inhale === p.inhale && pattern.hold === p.hold && pattern.exhale === p.exhale
                                        ? 'bg-[var(--accent-primary)] text-white'
                                        : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <p className="font-medium">{p.name}</p>
                                <p className="text-xs opacity-70">{p.inhale}s in • {p.hold}s hold • {p.exhale}s out</p>
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BreathingExercise;
