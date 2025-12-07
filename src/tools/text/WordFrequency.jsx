import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Copy, Check, Trash2 } from 'lucide-react';

const WordFrequency = () => {
    const [inputText, setInputText] = useState('');
    const [results, setResults] = useState([]);
    const [sortBy, setSortBy] = useState('frequency');
    const [minLength, setMinLength] = useState(1);
    const [copied, setCopied] = useState(false);

    const analyzeText = () => {
        if (!inputText.trim()) {
            setResults([]);
            return;
        }

        const words = inputText
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length >= minLength);

        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        let sorted = Object.entries(frequency).map(([word, count]) => ({
            word,
            count,
            percentage: ((count / words.length) * 100).toFixed(1)
        }));

        if (sortBy === 'frequency') {
            sorted.sort((a, b) => b.count - a.count);
        } else {
            sorted.sort((a, b) => a.word.localeCompare(b.word));
        }

        setResults(sorted);
    };

    const copyResults = () => {
        const text = results.map(r => `${r.word}: ${r.count}`).join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const maxCount = results.length > 0 ? Math.max(...results.map(r => r.count)) : 1;
    const totalWords = results.reduce((sum, r) => sum + r.count, 0);
    const uniqueWords = results.length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Word Frequency Counter</h2>
                <p className="text-[var(--text-muted)] text-sm">Analyze how often each word appears in your text</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Your Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste your text here to analyze word frequency..."
                        className="input w-full h-40 resize-none"
                    />
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm">Min word length:</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={minLength}
                            onChange={(e) => setMinLength(parseInt(e.target.value) || 1)}
                            className="input w-16 text-center"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="input"
                        >
                            <option value="frequency">Frequency</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={analyzeText}
                        className="btn-primary"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setInputText(''); setResults([]); }}
                        className="p-2 rounded-lg bg-[var(--bg-tertiary)]"
                    >
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>

                {results.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <div className="text-2xl font-bold text-blue-400">{totalWords}</div>
                                <div className="text-sm text-[var(--text-muted)]">Total Words</div>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <div className="text-2xl font-bold text-green-400">{uniqueWords}</div>
                                <div className="text-sm text-[var(--text-muted)]">Unique Words</div>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center sm:col-span-1 col-span-2">
                                <div className="text-2xl font-bold text-purple-400">{results[0]?.word}</div>
                                <div className="text-sm text-[var(--text-muted)]">Most Common</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-muted)]">{results.length} unique words found</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyResults}
                                className="flex items-center gap-1 text-sm text-[var(--accent-primary)]"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Results'}
                            </motion.button>
                        </div>

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {results.slice(0, 50).map((item, index) => (
                                <motion.div
                                    key={item.word}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="w-6 text-xs text-[var(--text-muted)]">{index + 1}</span>
                                    <span className="w-24 font-mono text-sm truncate">{item.word}</span>
                                    <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-6 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.count / maxCount) * 100}%` }}
                                            transition={{ delay: index * 0.02, duration: 0.3 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-end pr-2"
                                        >
                                            <span className="text-xs font-medium">{item.count}</span>
                                        </motion.div>
                                    </div>
                                    <span className="w-12 text-xs text-[var(--text-muted)] text-right">{item.percentage}%</span>
                                </motion.div>
                            ))}
                        </div>

                        {results.length > 50 && (
                            <p className="text-sm text-[var(--text-muted)] text-center">
                                Showing top 50 of {results.length} words
                            </p>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WordFrequency;
