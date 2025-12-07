import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowRight, RefreshCw } from 'lucide-react';

const SlugGenerator = () => {
    const [input, setInput] = useState('');
    const [separator, setSeparator] = useState('-');
    const [lowercase, setLowercase] = useState(true);
    const [removeNumbers, setRemoveNumbers] = useState(false);
    const [maxLength, setMaxLength] = useState(0);
    const [copied, setCopied] = useState(false);

    const generateSlug = () => {
        if (!input) return '';

        let slug = input
            .trim()
            // Remove accents/diacritics
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            // Replace special characters with spaces
            .replace(/[^a-zA-Z0-9\s-]/g, ' ')
            // Replace multiple spaces with single space
            .replace(/\s+/g, ' ')
            .trim()
            // Replace spaces with separator
            .replace(/\s/g, separator);

        if (lowercase) {
            slug = slug.toLowerCase();
        }

        if (removeNumbers) {
            slug = slug.replace(/[0-9]/g, '');
        }

        // Clean up multiple separators
        const sepRegex = new RegExp(`${separator}+`, 'g');
        slug = slug.replace(sepRegex, separator);

        // Remove leading/trailing separators
        const trimRegex = new RegExp(`^${separator}|${separator}$`, 'g');
        slug = slug.replace(trimRegex, '');

        if (maxLength > 0 && slug.length > maxLength) {
            slug = slug.substring(0, maxLength);
            // Don't end with separator
            if (slug.endsWith(separator)) {
                slug = slug.slice(0, -1);
            }
        }

        return slug;
    };

    const slug = generateSlug();

    const copySlug = () => {
        navigator.clipboard.writeText(slug);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const examples = [
        "Hello World! This is a Test",
        "How to Create URL Slugs in JavaScript",
        "10 Best Practices for SEO in 2024",
        "Résumé & Portfolio: John's Blog"
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Slug Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create URL-friendly slugs from text</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Text</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your title or text..."
                        className="input w-full h-24 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Quick Examples</label>
                    <div className="flex flex-wrap gap-2">
                        {examples.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(ex)}
                                className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] truncate max-w-40"
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Separator</label>
                        <div className="flex gap-2">
                            {['-', '_', '.'].map(sep => (
                                <button
                                    key={sep}
                                    onClick={() => setSeparator(sep)}
                                    className={`flex-1 py-2 rounded-lg font-mono text-lg transition-colors ${separator === sep ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    {sep}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Max Length (0 = unlimited)</label>
                        <input
                            type="number"
                            value={maxLength}
                            onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
                            min="0"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={lowercase}
                            onChange={(e) => setLowercase(e.target.checked)}
                            className="rounded"
                        />
                        Lowercase
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={removeNumbers}
                            onChange={(e) => setRemoveNumbers(e.target.checked)}
                            className="rounded"
                        />
                        Remove Numbers
                    </label>
                </div>

                {slug && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-[var(--bg-tertiary)] rounded-xl"
                    >
                        <p className="text-xs text-[var(--text-muted)] mb-2">Generated Slug:</p>
                        <p className="font-mono text-lg text-green-400 break-all">{slug}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-2">{slug.length} characters</p>
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copySlug}
                    disabled={!slug}
                    className="btn-primary w-full"
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Slug'}
                </motion.button>
            </div>
        </div>
    );
};

export default SlugGenerator;
