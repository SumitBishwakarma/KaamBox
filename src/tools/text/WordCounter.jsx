import { useState, useMemo } from 'react';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const WordCounter = () => {
    const [text, setText] = useState('');
    const { toast } = useToast();

    const stats = useMemo(() => {
        const trimmedText = text.trim();

        // Words
        const words = trimmedText ? trimmedText.split(/\s+/).filter(w => w.length > 0).length : 0;

        // Characters
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;

        // Sentences (rough estimation)
        const sentences = trimmedText ? (trimmedText.match(/[.!?]+/g) || []).length || (trimmedText.length > 0 ? 1 : 0) : 0;

        // Paragraphs
        const paragraphs = trimmedText ? trimmedText.split(/\n\n+/).filter(p => p.trim().length > 0).length : 0;

        // Reading time (average 200 words per minute)
        const readingTime = Math.ceil(words / 200);

        // Speaking time (average 150 words per minute)
        const speakingTime = Math.ceil(words / 150);

        return {
            words,
            characters,
            charactersNoSpaces,
            sentences,
            paragraphs,
            readingTime,
            speakingTime
        };
    }, [text]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        toast.success('Text copied to clipboard');
    };

    const handleClear = () => {
        setText('');
        toast.info('Text cleared');
    };

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                    { label: 'Words', value: stats.words },
                    { label: 'Characters', value: stats.characters },
                    { label: 'No Spaces', value: stats.charactersNoSpaces },
                    { label: 'Sentences', value: stats.sentences },
                    { label: 'Paragraphs', value: stats.paragraphs },
                    { label: 'Read Time', value: `${stats.readingTime} min` },
                    { label: 'Speak Time', value: `${stats.speakingTime} min` },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[var(--bg-tertiary)] rounded-xl p-4 text-center"
                    >
                        <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Text Input */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                        Enter your text below
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!text}
                            className="btn-secondary !py-2 !px-3 text-sm disabled:opacity-50"
                        >
                            <Copy size={16} />
                            Copy
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={!text}
                            className="btn-secondary !py-2 !px-3 text-sm disabled:opacity-50"
                        >
                            <RotateCcw size={16} />
                            Clear
                        </button>
                    </div>
                </div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your text here..."
                    className="textarea-field !min-h-[300px]"
                />
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                    <strong>Tip:</strong> Reading time is calculated at 200 words/minute. Speaking time is calculated at 150 words/minute.
                </p>
            </div>
        </div>
    );
};

export default WordCounter;
