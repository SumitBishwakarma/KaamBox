import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Sparkles, ArrowRightLeft } from 'lucide-react';

const AIParaphraser = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('standard');
    const [copied, setCopied] = useState(false);
    const [processing, setProcessing] = useState(false);

    const modes = [
        { id: 'standard', name: 'Standard', desc: 'Clear and natural' },
        { id: 'formal', name: 'Formal', desc: 'Professional tone' },
        { id: 'casual', name: 'Casual', desc: 'Friendly and relaxed' },
        { id: 'creative', name: 'Creative', desc: 'Unique expression' },
        { id: 'simple', name: 'Simplify', desc: 'Easy to understand' }
    ];

    // Synonym mappings for paraphrasing
    const synonyms = {
        'good': ['excellent', 'great', 'wonderful', 'fantastic', 'superb'],
        'bad': ['poor', 'terrible', 'awful', 'dreadful', 'unpleasant'],
        'big': ['large', 'huge', 'enormous', 'massive', 'substantial'],
        'small': ['tiny', 'little', 'compact', 'miniature', 'modest'],
        'important': ['crucial', 'vital', 'essential', 'significant', 'key'],
        'help': ['assist', 'aid', 'support', 'facilitate', 'enable'],
        'use': ['utilize', 'employ', 'apply', 'leverage', 'implement'],
        'make': ['create', 'produce', 'develop', 'generate', 'construct'],
        'get': ['obtain', 'acquire', 'receive', 'gain', 'secure'],
        'show': ['demonstrate', 'display', 'illustrate', 'reveal', 'present'],
        'think': ['believe', 'consider', 'contemplate', 'ponder', 'reflect'],
        'know': ['understand', 'comprehend', 'recognize', 'realize', 'grasp'],
        'want': ['desire', 'wish', 'seek', 'hope', 'aspire'],
        'need': ['require', 'demand', 'necessitate', 'must have', 'depend on'],
        'like': ['enjoy', 'appreciate', 'prefer', 'favor', 'admire'],
        'very': ['extremely', 'highly', 'remarkably', 'exceptionally', 'incredibly'],
        'also': ['additionally', 'furthermore', 'moreover', 'likewise', 'too'],
        'but': ['however', 'nevertheless', 'yet', 'although', 'though'],
        'because': ['since', 'as', 'due to', 'owing to', 'given that'],
        'so': ['therefore', 'thus', 'hence', 'consequently', 'accordingly']
    };

    const formalPrefixes = {
        'I think': 'It is my considered opinion that',
        'You should': 'It is recommended that one',
        'We need to': 'It is essential that we',
        'This is': 'This may be characterized as',
        'It\'s': 'It is',
        'Don\'t': 'Do not',
        'Can\'t': 'Cannot',
        'Won\'t': 'Will not'
    };

    const casualReplacements = {
        'utilize': 'use',
        'implement': 'do',
        'facilitate': 'help',
        'demonstrate': 'show',
        'therefore': 'so',
        'however': 'but',
        'additionally': 'also',
        'It is': "It's",
        'do not': "don't",
        'cannot': "can't"
    };

    const paraphrase = () => {
        if (!inputText.trim()) return;

        setProcessing(true);

        setTimeout(() => {
            let result = inputText;

            if (mode === 'standard' || mode === 'creative') {
                // Replace words with synonyms
                Object.keys(synonyms).forEach(word => {
                    const regex = new RegExp(`\\b${word}\\b`, 'gi');
                    const replacement = synonyms[word][Math.floor(Math.random() * synonyms[word].length)];
                    result = result.replace(regex, replacement);
                });
            }

            if (mode === 'formal') {
                // Apply formal transformations
                Object.keys(formalPrefixes).forEach(phrase => {
                    result = result.replace(new RegExp(phrase, 'gi'), formalPrefixes[phrase]);
                });
                // Replace words with formal synonyms
                Object.keys(synonyms).forEach(word => {
                    const formalSynonyms = synonyms[word].filter(s => s.length > 5);
                    if (formalSynonyms.length > 0) {
                        const regex = new RegExp(`\\b${word}\\b`, 'gi');
                        result = result.replace(regex, formalSynonyms[0]);
                    }
                });
            }

            if (mode === 'casual') {
                // Apply casual transformations
                Object.keys(casualReplacements).forEach(phrase => {
                    result = result.replace(new RegExp(phrase, 'gi'), casualReplacements[phrase]);
                });
            }

            if (mode === 'simple') {
                // Simplify by using shorter words
                Object.keys(casualReplacements).forEach(phrase => {
                    result = result.replace(new RegExp(phrase, 'gi'), casualReplacements[phrase]);
                });
                // Break long sentences
                result = result.replace(/([.!?])\s+/g, '$1\n');
            }

            if (mode === 'creative') {
                // Add some creative restructuring
                const sentences = result.split(/(?<=[.!?])\s+/);
                if (sentences.length > 1) {
                    // Occasionally reorder sentences
                    result = sentences.map((s, i) => {
                        if (i > 0 && Math.random() > 0.7) {
                            return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
                        }
                        return s;
                    }).join(' ');
                }
            }

            setOutputText(result);
            setProcessing(false);
        }, 800);
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
                <p className="text-[var(--text-muted)] text-sm">Rewrite text in different styles</p>
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
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Paraphrase
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

                {/* Output */}
                {outputText && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className you="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                Paraphrased Text
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
                            {outputText.split(/\s+/).filter(w => w).length} words
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIParaphraser;
