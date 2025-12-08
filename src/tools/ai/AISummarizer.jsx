import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, Sparkles, RefreshCw, List, AlignLeft } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AISummarizer = () => {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [mode, setMode] = useState('paragraph');
    const [length, setLength] = useState('medium');
    const [copied, setCopied] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const modes = [
        { id: 'paragraph', name: 'Paragraph', icon: <AlignLeft size={18} /> },
        { id: 'bullets', name: 'Key Points', icon: <List size={18} /> }
    ];

    const lengths = [
        { id: 'short', name: 'Short', desc: '~2-3 sentences' },
        { id: 'medium', name: 'Medium', desc: '~5-7 sentences' },
        { id: 'long', name: 'Detailed', desc: 'Comprehensive' }
    ];

    const summarize = async () => {
        if (!inputText.trim()) return;

        setProcessing(true);
        setError('');

        const lengthGuide = {
            short: 'very brief (2-3 sentences)',
            medium: 'moderate length (5-7 sentences)',
            long: 'comprehensive and detailed'
        };

        const formatGuide = mode === 'paragraph'
            ? 'as a flowing paragraph'
            : 'as bullet points (use - for each point)';

        const prompt = `Summarize the following text ${formatGuide}. Make it ${lengthGuide[length]}.

Text to summarize:
"""
${inputText}
"""

Provide only the summary, nothing else.`;

        const result = await generateWithGemini(prompt, {
            temperature: 0.5,
            maxTokens: length === 'long' ? 1024 : length === 'medium' ? 512 : 256
        });

        if (result.success) {
            setSummary(result.text.trim());
        } else {
            setError(result.error || 'Failed to summarize. Please try again.');
        }

        setProcessing(false);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const inputWordCount = inputText.split(/\s+/).filter(w => w).length;
    const outputWordCount = summary.split(/\s+/).filter(w => w).length;

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Text Summarizer</h2>
                <p className="text-[var(--text-muted)] text-sm">Summarize long texts using AI</p>
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
                                    <p className="text-xs opacity-70">{l.desc}</p>
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
                        {inputWordCount} words
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
                            AI Analyzing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Summarize with AI
                        </>
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Output */}
                {summary && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-pink-500" />
                                AI Summary
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
                            <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            Powered by Gemini AI
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AISummarizer;
