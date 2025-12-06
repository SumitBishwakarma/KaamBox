import { useState } from 'react';
import { Copy, Trash2, ArrowUpDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DuplicateRemover = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });
    const [caseSensitive, setCaseSensitive] = useState(true);
    const [trimLines, setTrimLines] = useState(true);
    const { toast } = useToast();

    const removeDuplicates = () => {
        if (!input.trim()) {
            toast.warning('Please enter some text');
            return;
        }

        let lines = input.split('\n');
        const originalCount = lines.length;

        if (trimLines) {
            lines = lines.map(line => line.trim());
        }

        const seen = new Set();
        const uniqueLines = lines.filter(line => {
            const key = caseSensitive ? line : line.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        setOutput(uniqueLines.join('\n'));
        setStats({
            original: originalCount,
            unique: uniqueLines.length,
            removed: originalCount - uniqueLines.length
        });
        toast.success(`Removed ${originalCount - uniqueLines.length} duplicate lines`);
    };

    const sortLines = () => {
        if (!output) return;
        const sorted = output.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
        setOutput(sorted);
        toast.success('Lines sorted alphabetically');
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setStats({ original: 0, unique: 0, removed: 0 });
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Input Text (one item per line)
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter text with duplicate lines..."
                        className="textarea-field !min-h-[250px] font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Output (duplicates removed)
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Unique lines will appear here..."
                        className="textarea-field !min-h-[250px] font-mono text-sm bg-[var(--bg-tertiary)]"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={caseSensitive}
                        onChange={(e) => setCaseSensitive(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm">Case Sensitive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={trimLines}
                        onChange={(e) => setTrimLines(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm">Trim Whitespace</span>
                </label>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={removeDuplicates} className="btn-primary">
                    Remove Duplicates
                </button>
                <button onClick={sortLines} className="btn-secondary" disabled={!output}>
                    <ArrowUpDown size={18} />
                    Sort A-Z
                </button>
                <button onClick={copyOutput} className="btn-secondary" disabled={!output}>
                    <Copy size={18} />
                    Copy
                </button>
                <button onClick={clearAll} className="btn-secondary">
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>

            {stats.original > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.original}</p>
                        <p className="text-sm text-[var(--text-muted)]">Original Lines</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.unique}</p>
                        <p className="text-sm text-[var(--text-muted)]">Unique Lines</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-red-400">{stats.removed}</p>
                        <p className="text-sm text-[var(--text-muted)]">Removed</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DuplicateRemover;
