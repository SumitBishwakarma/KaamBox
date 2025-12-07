import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, RotateCcw, Trophy, Clock } from 'lucide-react';

const TypingSpeedTest = () => {
    const [status, setStatus] = useState('ready'); // ready, running, finished
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLimit, setTimeLimit] = useState(60);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRef = useRef(null);

    const sampleTexts = [
        "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is perfect for testing your typing speed.",
        "Programming is the art of telling a computer what to do. With practice and dedication, you can master the keyboard and become more productive.",
        "Technology is best when it brings people together. The internet has connected billions of people around the world in ways we never imagined.",
        "Success is not final, failure is not fatal. It is the courage to continue that counts. Keep typing and never give up on improving your skills.",
        "In the world of technology, learning never stops. Every day brings new challenges and opportunities to grow as a developer and problem solver."
    ];

    useEffect(() => {
        setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    }, []);

    useEffect(() => {
        let timer;
        if (status === 'running' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setStatus('finished');
                        setEndTime(Date.now());
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    const startTest = () => {
        setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
        setUserInput('');
        setCurrentIndex(0);
        setErrors(0);
        setTimeLeft(timeLimit);
        setStatus('running');
        setStartTime(Date.now());
        setEndTime(null);
        inputRef.current?.focus();
    };

    const handleInputChange = (e) => {
        if (status !== 'running') return;

        const value = e.target.value;
        const lastChar = value[value.length - 1];
        const expectedChar = text[currentIndex];

        if (lastChar === expectedChar) {
            setCurrentIndex(currentIndex + 1);
            setUserInput(value);

            if (currentIndex + 1 >= text.length) {
                setStatus('finished');
                setEndTime(Date.now());
            }
        } else if (value.length > userInput.length) {
            setErrors(errors + 1);
        }
    };

    const calculateWPM = () => {
        if (!startTime || !endTime) return 0;
        const timeInMinutes = (endTime - startTime) / 60000;
        const wordsTyped = currentIndex / 5; // Standard: 5 characters = 1 word
        return Math.round(wordsTyped / timeInMinutes);
    };

    const calculateAccuracy = () => {
        if (currentIndex === 0) return 100;
        return Math.round(((currentIndex - errors) / currentIndex) * 100);
    };

    const calculateCPM = () => {
        if (!startTime || !endTime) return 0;
        const timeInMinutes = (endTime - startTime) / 60000;
        return Math.round(currentIndex / timeInMinutes);
    };

    const renderText = () => {
        return text.split('').map((char, index) => {
            let className = 'text-[var(--text-muted)]';
            if (index < currentIndex) {
                className = 'text-green-400';
            } else if (index === currentIndex) {
                className = 'text-white bg-[var(--accent-primary)] px-0.5 rounded';
            }
            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Typing Speed Test</h2>
                <p className="text-[var(--text-muted)] text-sm">Test and improve your typing speed</p>
            </div>

            <div className="space-y-4">
                {status === 'ready' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium mb-2">Test Duration</label>
                            <div className="flex gap-2">
                                {[30, 60, 120].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => { setTimeLimit(t); setTimeLeft(t); }}
                                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeLimit === t ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                            }`}
                                    >
                                        {t}s
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startTest}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            <Keyboard className="w-5 h-5 mr-2" />
                            Start Typing Test
                        </motion.button>
                    </>
                )}

                {status === 'running' && (
                    <>
                        <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
                                <span className="text-2xl font-bold">{timeLeft}s</span>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span>WPM: <strong>{currentIndex > 0 ? Math.round((currentIndex / 5) / ((Date.now() - startTime) / 60000)) : 0}</strong></span>
                                <span>Errors: <strong className="text-red-400">{errors}</strong></span>
                            </div>
                        </div>

                        <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl text-lg leading-relaxed font-mono">
                            {renderText()}
                        </div>

                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            className="input w-full text-lg font-mono"
                            placeholder="Start typing here..."
                            autoFocus
                        />

                        <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentIndex / text.length) * 100}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                        </div>
                    </>
                )}

                {status === 'finished' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
                            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                            <h3 className="text-3xl font-bold mb-2">{calculateWPM()} WPM</h3>
                            <p className="text-[var(--text-muted)]">Words Per Minute</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <div className="text-2xl font-bold text-green-400">{calculateAccuracy()}%</div>
                                <div className="text-sm text-[var(--text-muted)]">Accuracy</div>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <div className="text-2xl font-bold text-blue-400">{calculateCPM()}</div>
                                <div className="text-sm text-[var(--text-muted)]">CPM</div>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <div className="text-2xl font-bold text-red-400">{errors}</div>
                                <div className="text-sm text-[var(--text-muted)]">Errors</div>
                            </div>
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)] mb-2">Progress:</p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-3">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                                        style={{ width: `${(currentIndex / text.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm">{currentIndex}/{text.length}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={startTest}
                            className="btn-primary w-full"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TypingSpeedTest;
