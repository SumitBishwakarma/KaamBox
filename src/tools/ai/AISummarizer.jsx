import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, Sparkles, RefreshCw, List, AlignLeft } from 'lucide-react';

const AISummarizer = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [keyPoints, setKeyPoints] = useState([]);
    const [mode, setMode] = useState('paragraph');
    const [length, setLength] = useState('medium');
    const [copied, setCopied] = useState(false);
    const [processing, setProcessing] = useState(false);

    const modes = [
        { id: 'paragraph', name: 'Paragraph', icon: <AlignLeft size={18} /> },
        { id: 'bullets', name: 'Key Points', icon: <List size={18} /> }
    ];

    const lengths = [
        { id: 'short', name: 'Short', percent: 15 },
        { id: 'medium', name: 'Medium', percent: 30 },
        { id: 'long', name: 'Detailed', percent: 50 }
    ];

    const summarize = () => {
        if (!inputText.trim()) return;

        setProcessing(true);

        setTimeout(() => {
            // Split into sentences
            const sentences = inputText
                .split(/(?<=[.!?])\s+/)
                .filter(s => s.trim().length > 10);

            if (sentences.length === 0) {
                setSummary(inputText);
                setKeyPoints([inputText]);
                setProcessing(false);
                return;
            }

            // Score sentences based on importance
            const scoredSentences = sentences.map((sentence, index) => {
                let score = 0;

                // First and last sentences are usually important
                if (index === 0) score += 3;
                if (index === sentences.length - 1) score += 2;

                // Sentences with keywords score higher
                const keywords = ['important', 'key', 'main', 'significant', 'essential',
                    'crucial', 'therefore', 'however', 'conclusion', 'result', 'finally',
                    'in summary', 'overall', 'notably', 'specifically', 'because'];
                keywords.forEach(kw => {
                    if (sentence.toLowerCase().includes(kw)) score += 2;
                });

                // Longer sentences might have more content
                const wordCount = sentence.split(/\s+/).length;
                if (wordCount > 10 && wordCount < 40) score += 1;

                // Sentences with numbers might have facts
                if (/\d+/.test(sentence)) score += 1;

                return { sentence, score, index };
            });

            // Sort by score
            scoredSentences.sort((a, b) => b.score - a.score);

            // Calculate how many sentences to include based on length
            const lengthPercent = lengths.find(l => l.id === length)?.percent || 30;
            const numSentences = Math.max(1, Math.ceil(sentences.length * (lengthPercent / 100)));

            // Get top sentences
            const topSentences = scoredSentences
                .slice(0, numSentences)
                .sort((a, b) => a.index - b.index) // Restore original order
                .map(s => s.sentence);

            if (mode === 'paragraph') {
                setSummary(topSentences.join(' '));
                setKeyPoints([]);
            } else {
                // Extract key points
                const points = topSentences.map(s => {
                    // Clean up the sentence for bullet points
                    let point = s.trim();
                    // Remove trailing period for cleaner bullets
                    point = point.replace(/[.!?]$/, '');
                    return point;
                });
                setKeyPoints(points);
                setSummary('');
            }

            setProcessing(false);
        }, 800);
    };

    const copyToClipboard = async () => {
        const textToCopy = mode === 'paragraph'
            ? summary
            : keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n');
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const inputWordCount = inputText.split(/\s+/).filter(w => w).length;
    const outputWordCount = mode === 'paragraph'
        ? summary.split(/\s+/).filter(w => w).length
        : keyPoints.join(' ').split(/\s+/).filter(w => w).length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Text Summarizer</h2>
                <p className="text-[var(--text-muted)] text-sm">Summarize long texts into key insights</p>
            </div>

            <div className="space-y-4">
                {/* Mode Selection */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Output Format</label>
                        <div className="flex gap-2">
                            {modes.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`flex-1 p-3 rounded-xl flex items-center justify-center gap-2 transition-colors ${mode === m.id
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                        }`}
                                >
                                    {m.icon}
                                    <span className="text-sm">{m.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Summary Length</label>
                        <div className="flex gap-2">
                            {lengths.map(l => (
                                <button
                                    key={l.id}
                                    onClick={() => setLength(l.id)}
                                    className={`flex-1 p-3 rounded-xl text-center transition-colors ${length === l.id
                                            ? 'bg-pink-500 text-white'
                                            : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                        }`}
                                >
                                    <p className="text-sm font-medium">{l.name}</p>
                                    <p className="text-xs opacity-70">~{l.percent}%</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Paste Your Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste the article, essay, or document you want to summarize..."
                        className="input w-full h-48 resize-none"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        {inputWordCount} words • {inputText.split(/(?<=[.!?])\s+/).filter(s => s.trim()).length} sentences
                    </p>
                </div>

                {/* Summarize Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={summarize}
                    disabled={!inputText.trim() || processing}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {processing ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Summarize Text
                        </>
                    )}
                </motion.button>

                {/* Output */}
                {(summary || keyPoints.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-pink-500" />
                                Summary
                                <span className="text-xs text-[var(--text-muted)]">
                                    ({outputWordCount} words - {Math.round((outputWordCount / inputWordCount) * 100)}% of original)
                                </span>
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </motion.button>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-pink-500/20">
                            {mode === 'paragraph' ? (
                                <p className="leading-relaxed">{summary}</p>
                            ) : (
                                <ul className="space-y-2">
                                    {keyPoints.map((point, index) => (
                                        <li key={index} className="flex gap-2">
                                            <span className="text-pink-500 font-bold">{index + 1}.</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AISummarizer;
