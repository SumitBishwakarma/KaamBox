import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Play, Check, X, Copy, Info } from 'lucide-react';

const RegexTester = () => {
    const [pattern, setPattern] = useState('');
    const [flags, setFlags] = useState('g');
    const [testText, setTestText] = useState('');
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const flagOptions = [
        { flag: 'g', name: 'Global', desc: 'Find all matches' },
        { flag: 'i', name: 'Case Insensitive', desc: 'Case insensitive matching' },
        { flag: 'm', name: 'Multiline', desc: '^ and $ match line boundaries' },
        { flag: 's', name: 'Dotall', desc: '. matches newlines' }
    ];

    const commonPatterns = [
        { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
        { name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w.-]*)*' },
        { name: 'Phone', pattern: '\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
        { name: 'IP Address', pattern: '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b' },
        { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
        { name: 'Hex Color', pattern: '#[0-9A-Fa-f]{6}\\b' },
        { name: 'HTML Tag', pattern: '<[^>]+>' },
        { name: 'Numbers Only', pattern: '\\d+' }
    ];

    const testRegex = () => {
        if (!pattern) {
            setMatches([]);
            setError('');
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const allMatches = [];
            let match;

            if (flags.includes('g')) {
                while ((match = regex.exec(testText)) !== null) {
                    allMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                    if (match.index === regex.lastIndex) regex.lastIndex++;
                }
            } else {
                match = regex.exec(testText);
                if (match) {
                    allMatches.push({
                        match: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }

            setMatches(allMatches);
            setError('');
        } catch (e) {
            setError(e.message);
            setMatches([]);
        }
    };

    const toggleFlag = (flag) => {
        if (flags.includes(flag)) {
            setFlags(flags.replace(flag, ''));
        } else {
            setFlags(flags + flag);
        }
    };

    const highlightMatches = () => {
        if (!pattern || !testText || error) return testText;

        try {
            const regex = new RegExp(pattern, flags);
            const parts = [];
            let lastIndex = 0;

            testText.replace(regex, (match, ...args) => {
                const index = args[args.length - 2];
                if (index > lastIndex) {
                    parts.push({ text: testText.slice(lastIndex, index), highlight: false });
                }
                parts.push({ text: match, highlight: true });
                lastIndex = index + match.length;
            });

            if (lastIndex < testText.length) {
                parts.push({ text: testText.slice(lastIndex), highlight: false });
            }

            return parts;
        } catch {
            return testText;
        }
    };

    const copyPattern = () => {
        navigator.clipboard.writeText(`/${pattern}/${flags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const highlighted = highlightMatches();

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Regex Tester</h2>
                <p className="text-[var(--text-muted)] text-sm">Test and debug regular expressions in real-time</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Regular Expression</label>
                    <div className="flex gap-2">
                        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg px-3">
                            <span className="text-[var(--text-muted)]">/</span>
                        </div>
                        <input
                            type="text"
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                            placeholder="Enter regex pattern..."
                            className="input flex-1 font-mono"
                        />
                        <div className="flex items-center bg-[var(--bg-tertiary)] rounded-lg px-3">
                            <span className="text-[var(--text-muted)]">/{flags}</span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyPattern}
                            className="p-3 rounded-lg bg-[var(--bg-tertiary)]"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </motion.button>
                    </div>
                    {error && (
                        <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                            <X className="w-4 h-4" /> {error}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Flags</label>
                    <div className="flex flex-wrap gap-2">
                        {flagOptions.map(opt => (
                            <button
                                key={opt.flag}
                                onClick={() => toggleFlag(opt.flag)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${flags.includes(opt.flag) ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                                title={opt.desc}
                            >
                                {opt.flag} - {opt.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Test String</label>
                    <textarea
                        value={testText}
                        onChange={(e) => setTestText(e.target.value)}
                        placeholder="Enter text to test against the regex..."
                        className="input w-full h-32 resize-none font-mono"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={testRegex}
                    className="btn-primary w-full"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Test Regex
                </motion.button>

                {matches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 text-green-400">
                            <Check className="w-5 h-5" />
                            <span className="font-medium">{matches.length} match{matches.length > 1 ? 'es' : ''} found</span>
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <p className="text-sm font-medium mb-2">Highlighted Matches:</p>
                            <div className="font-mono text-sm whitespace-pre-wrap">
                                {Array.isArray(highlighted) ? highlighted.map((part, i) => (
                                    <span key={i} className={part.highlight ? 'bg-yellow-500/30 text-yellow-300 px-0.5 rounded' : ''}>
                                        {part.text}
                                    </span>
                                )) : highlighted}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium">Match Details:</p>
                            {matches.map((m, i) => (
                                <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-mono text-green-400">"{m.match}"</span>
                                        <span className="text-[var(--text-muted)]">Index: {m.index}</span>
                                    </div>
                                    {m.groups.length > 0 && (
                                        <div className="mt-1 text-[var(--text-muted)]">
                                            Groups: {m.groups.map((g, j) => <span key={j} className="ml-2">({j + 1}) {g}</span>)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Common Patterns
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {commonPatterns.map(p => (
                            <button
                                key={p.name}
                                onClick={() => setPattern(p.pattern)}
                                className="px-2 py-1 text-xs bg-[var(--bg-secondary)] rounded hover:bg-[var(--accent-primary)] hover:text-white transition-colors"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegexTester;
