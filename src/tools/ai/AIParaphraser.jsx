import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Sparkles, ArrowRightLeft } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AIParaphraser = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('standard');
    const [copied, setCopied] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const modes = [
        { id: 'standard', name: 'Standard', desc: 'Clear and natural' },
        { id: 'formal', name: 'Formal', desc: 'Professional tone' },
        { id: 'casual', name: 'Casual', desc: 'Friendly and relaxed' },
        { id: 'creative', name: 'Creative', desc: 'Unique expression' },
        { id: 'simple', name: 'Simplify', desc: 'Easy to understand' }
    ];

    const modePrompts = {
        standard: 'Paraphrase the following text in a clear and natural way, maintaining the original meaning:',
        formal: 'Rewrite the following text in a formal, professional tone suitable for business communication:',
        casual: 'Rewrite the following text in a casual, friendly, conversational tone:',
        creative: 'Creatively rewrite the following text with unique expressions and engaging language:',
        simple: 'Simplify the following text to make it easy to understand for anyone:'
    };

    const paraphrase = async () => {
        if (!inputText.trim()) return;

        setProcessing(true);
        setError('');

        const prompt = `${modePrompts[mode]}

"${inputText}"

Only provide the paraphrased text, nothing else.`;

        const result = await generateWithGemini(prompt, { temperature: 0.7 });

        if (result.success) {
            setOutputText(result.text.trim());
        } else {
            setError(result.error || 'Failed to paraphrase. Please try again.');
        }

        setProcessing(false);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapTexts = () => {
        setInputText(outputText);
        setOutputText('');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Paraphraser</h2>
                <p className="text-[var(--text-muted)] text-sm">Rewrite text in different styles using AI</p>
            </div>

            <div className="space-y-4">
                {/* Mode Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Paraphrase Mode</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {modes.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${mode === m.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <p className="font-medium text-sm">{m.name}</p>
                                <p className="text-xs opacity-70">{m.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Original Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter the text you want to paraphrase..."
                        className="input w-full h-40 resize-none"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        {inputText.split(/\s+/).filter(w => w).length} words
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={paraphrase}
                        disabled={!inputText.trim() || processing}
                        className="btn-primary flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                        {processing ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                AI Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Paraphrase with AI
                            </>
                        )}
                    </motion.button>
                    {outputText && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={swapTexts}
                            className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                            title="Use output as input"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Output */}
                {outputText && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                AI Paraphrased Text
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
                            <p className="whitespace-pre-wrap leading-relaxed">{outputText}</p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            {outputText.split(/\s+/).filter(w => w).length} words • Powered by Gemini AI
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIParaphraser;
