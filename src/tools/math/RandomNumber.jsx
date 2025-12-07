import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, RotateCcw, Copy, Check } from 'lucide-react';

const RandomNumberGenerator = () => {
    const [min, setMin] = useState(1);
    const [max, setMax] = useState(100);
    const [count, setCount] = useState(1);
    const [allowDuplicates, setAllowDuplicates] = useState(true);
    const [results, setResults] = useState([]);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateNumbers = () => {
        setIsGenerating(true);

        setTimeout(() => {
            const minVal = Math.min(min, max);
            const maxVal = Math.max(min, max);
            const range = maxVal - minVal + 1;

            let numbers = [];

            if (allowDuplicates) {
                for (let i = 0; i < count; i++) {
                    numbers.push(Math.floor(Math.random() * range) + minVal);
                }
            } else {
                if (count > range) {
                    // Can't generate more unique numbers than the range allows
                    for (let i = minVal; i <= maxVal; i++) {
                        numbers.push(i);
                    }
                } else {
                    const available = [];
                    for (let i = minVal; i <= maxVal; i++) {
                        available.push(i);
                    }
                    for (let i = 0; i < count && available.length > 0; i++) {
                        const index = Math.floor(Math.random() * available.length);
                        numbers.push(available.splice(index, 1)[0]);
                    }
                }
            }

            setResults(numbers);
            setIsGenerating(false);
        }, 300);
    };

    const copyResults = () => {
        navigator.clipboard.writeText(results.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const presets = [
        { name: 'Dice (1-6)', min: 1, max: 6, count: 1 },
        { name: 'Lottery (1-49)', min: 1, max: 49, count: 6 },
        { name: 'Coin Flip', min: 0, max: 1, count: 1 },
        { name: 'Percentage', min: 1, max: 100, count: 1 }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Random Number Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate random numbers for any purpose</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Minimum</label>
                        <input
                            type="number"
                            value={min}
                            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                            className="input w-full text-center text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Maximum</label>
                        <input
                            type="number"
                            value={max}
                            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                            className="input w-full text-center text-lg"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">How Many Numbers?</label>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCount(Math.max(1, count - 1))}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            -
                        </motion.button>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                            className="input w-20 text-center text-xl"
                        />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCount(Math.min(100, count + 1))}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            +
                        </motion.button>
                    </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allowDuplicates}
                        onChange={(e) => setAllowDuplicates(e.target.checked)}
                        className="w-5 h-5 rounded"
                    />
                    <span className="text-sm">Allow duplicate numbers</span>
                </label>

                <div>
                    <p className="text-sm text-[var(--text-muted)] mb-2">Quick Presets:</p>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(preset => (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    setMin(preset.min);
                                    setMax(preset.max);
                                    setCount(preset.count);
                                }}
                                className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateNumbers}
                    disabled={isGenerating}
                    className="btn-primary w-full py-4 text-lg"
                >
                    {isGenerating ? (
                        <RotateCcw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <Shuffle className="w-5 h-5 mr-2" />
                    )}
                    Generate Random Numbers
                </motion.button>

                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-[var(--text-muted)]">{results.length} number{results.length > 1 ? 's' : ''} generated</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={copyResults}
                                className="flex items-center gap-1 text-sm text-[var(--accent-primary)]"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center">
                            {results.map((num, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="w-16 h-16 flex items-center justify-center bg-[var(--bg-tertiary)] rounded-xl text-2xl font-bold"
                                >
                                    {num}
                                </motion.div>
                            ))}
                        </div>

                        {results.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-[var(--bg-tertiary)] grid grid-cols-3 gap-4 text-center text-sm">
                                <div>
                                    <p className="text-[var(--text-muted)]">Sum</p>
                                    <p className="font-bold">{results.reduce((a, b) => a + b, 0)}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--text-muted)]">Average</p>
                                    <p className="font-bold">{(results.reduce((a, b) => a + b, 0) / results.length).toFixed(1)}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--text-muted)]">Range</p>
                                    <p className="font-bold">{Math.min(...results)} - {Math.max(...results)}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RandomNumberGenerator;
