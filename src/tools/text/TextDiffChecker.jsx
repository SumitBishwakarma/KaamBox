import { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Copy, Check, RotateCcw } from 'lucide-react';

const TextDiffChecker = () => {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [copied, setCopied] = useState(false);

    const getDiff = () => {
        const lines1 = text1.split('\n');
        const lines2 = text2.split('\n');
        const maxLen = Math.max(lines1.length, lines2.length);
        const result = [];

        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';

            if (line1 === line2) {
                result.push({ type: 'same', line: line1 });
            } else {
                if (line1 && (!line2 || lines1.length > lines2.length)) {
                    result.push({ type: 'removed', line: line1 });
                }
                if (line2) {
                    result.push({ type: 'added', line: line2 });
                }
            }
        }

        return result;
    };

    const diff = getDiff();
    const additions = diff.filter(d => d.type === 'added').length;
    const removals = diff.filter(d => d.type === 'removed').length;

    const swapTexts = () => {
        const temp = text1;
        setText1(text2);
        setText2(temp);
    };

    const copyDiff = () => {
        const diffText = diff.map(d => {
            if (d.type === 'added') return `+ ${d.line}`;
            if (d.type === 'removed') return `- ${d.line}`;
            return `  ${d.line}`;
        }).join('\n');
        navigator.clipboard.writeText(diffText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Text Diff Checker</h2>
                <p className="text-[var(--text-muted)] text-sm">Compare two texts and highlight differences</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Original Text</label>
                        <textarea
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            placeholder="Paste original text here..."
                            className="input w-full h-40 resize-none font-mono text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Modified Text</label>
                        <textarea
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            placeholder="Paste modified text here..."
                            className="input w-full h-40 resize-none font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={swapTexts}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </motion.button>
                </div>

                {(text1 || text2) && (
                    <>
                        <div className="flex gap-4 justify-center text-sm">
                            <span className="text-green-500">+{additions} added</span>
                            <span className="text-red-500">-{removals} removed</span>
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl max-h-64 overflow-y-auto">
                            <pre className="font-mono text-sm space-y-1">
                                {diff.map((d, i) => (
                                    <div
                                        key={i}
                                        className={`px-2 py-0.5 rounded ${d.type === 'added'
                                                ? 'bg-green-500/20 text-green-400'
                                                : d.type === 'removed'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : ''
                                            }`}
                                    >
                                        <span className="inline-block w-4 mr-2">
                                            {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}
                                        </span>
                                        {d.line || ' '}
                                    </div>
                                ))}
                            </pre>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={copyDiff}
                            className="btn-primary w-full"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied!' : 'Copy Diff'}
                        </motion.button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TextDiffChecker;
