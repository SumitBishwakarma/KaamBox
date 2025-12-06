import { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CodeDiff = () => {
    const [textA, setTextA] = useState('');
    const [textB, setTextB] = useState('');
    const [viewMode, setViewMode] = useState('inline'); // inline or split
    const { toast } = useToast();

    const computeDiff = useMemo(() => {
        if (!textA && !textB) return [];

        const linesA = textA.split('\n');
        const linesB = textB.split('\n');
        const diff = [];
        const maxLines = Math.max(linesA.length, linesB.length);

        for (let i = 0; i < maxLines; i++) {
            const lineA = linesA[i];
            const lineB = linesB[i];

            if (lineA === lineB) {
                diff.push({ type: 'same', lineA, lineB, lineNum: i + 1 });
            } else if (lineA === undefined) {
                diff.push({ type: 'added', lineA: '', lineB, lineNum: i + 1 });
            } else if (lineB === undefined) {
                diff.push({ type: 'removed', lineA, lineB: '', lineNum: i + 1 });
            } else {
                diff.push({ type: 'modified', lineA, lineB, lineNum: i + 1 });
            }
        }

        return diff;
    }, [textA, textB]);

    const stats = useMemo(() => {
        const added = computeDiff.filter(d => d.type === 'added').length;
        const removed = computeDiff.filter(d => d.type === 'removed').length;
        const modified = computeDiff.filter(d => d.type === 'modified').length;
        const same = computeDiff.filter(d => d.type === 'same').length;
        return { added, removed, modified, same };
    }, [computeDiff]);

    const swapTexts = () => {
        const temp = textA;
        setTextA(textB);
        setTextB(temp);
    };

    const copyDiff = () => {
        const diffText = computeDiff.map(d => {
            if (d.type === 'same') return `  ${d.lineA}`;
            if (d.type === 'added') return `+ ${d.lineB}`;
            if (d.type === 'removed') return `- ${d.lineA}`;
            return `- ${d.lineA}\n+ ${d.lineB}`;
        }).join('\n');
        navigator.clipboard.writeText(diffText);
        toast.success('Diff copied to clipboard');
    };

    const getLineStyle = (type) => {
        switch (type) {
            case 'added': return 'bg-green-500/20 border-l-4 border-green-500';
            case 'removed': return 'bg-red-500/20 border-l-4 border-red-500';
            case 'modified': return 'bg-yellow-500/20 border-l-4 border-yellow-500';
            default: return '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Original Text
                    </label>
                    <textarea
                        value={textA}
                        onChange={(e) => setTextA(e.target.value)}
                        placeholder="Paste original text here..."
                        className="textarea-field !min-h-[200px] font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Modified Text
                    </label>
                    <textarea
                        value={textB}
                        onChange={(e) => setTextB(e.target.value)}
                        placeholder="Paste modified text here..."
                        className="textarea-field !min-h-[200px] font-mono text-sm"
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <button onClick={swapTexts} className="btn-secondary">
                    <ArrowLeftRight size={18} />
                    Swap
                </button>
                <button onClick={copyDiff} className="btn-secondary" disabled={computeDiff.length === 0}>
                    <Copy size={18} />
                    Copy Diff
                </button>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-[var(--text-muted)]">View:</span>
                    <button
                        onClick={() => setViewMode('inline')}
                        className={`px-3 py-1 rounded text-sm ${viewMode === 'inline' ? 'bg-blue-500' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                        Inline
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={`px-3 py-1 rounded text-sm ${viewMode === 'split' ? 'bg-blue-500' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                        Split
                    </button>
                </div>
            </div>

            {computeDiff.length > 0 && (
                <>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                            <p className="text-xl font-bold text-green-400">+{stats.added}</p>
                            <p className="text-xs text-[var(--text-muted)]">Added</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                            <p className="text-xl font-bold text-red-400">-{stats.removed}</p>
                            <p className="text-xs text-[var(--text-muted)]">Removed</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                            <p className="text-xl font-bold text-yellow-400">{stats.modified}</p>
                            <p className="text-xs text-[var(--text-muted)]">Modified</p>
                        </div>
                        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg text-center">
                            <p className="text-xl font-bold text-blue-400">{stats.same}</p>
                            <p className="text-xs text-[var(--text-muted)]">Unchanged</p>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-tertiary)] rounded-xl overflow-hidden">
                        <div className="p-3 border-b border-[var(--border-primary)]">
                            <span className="text-sm font-medium">Diff Result</span>
                        </div>
                        <div className="max-h-[400px] overflow-auto">
                            {viewMode === 'inline' ? (
                                <div className="font-mono text-sm">
                                    {computeDiff.map((d, i) => (
                                        <div key={i} className={`flex ${getLineStyle(d.type)}`}>
                                            <span className="w-12 px-2 text-[var(--text-muted)] text-right border-r border-[var(--border-primary)] select-none">
                                                {d.lineNum}
                                            </span>
                                            <span className="w-6 text-center select-none">
                                                {d.type === 'added' && '+'}
                                                {d.type === 'removed' && '-'}
                                                {d.type === 'modified' && '~'}
                                            </span>
                                            <pre className="flex-1 px-2 whitespace-pre-wrap">
                                                {d.type === 'removed' || d.type === 'same' ? d.lineA : d.lineB}
                                            </pre>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 font-mono text-sm">
                                    <div className="border-r border-[var(--border-primary)]">
                                        {computeDiff.map((d, i) => (
                                            <div key={i} className={`flex ${d.type === 'removed' || d.type === 'modified' ? 'bg-red-500/20' : ''}`}>
                                                <span className="w-8 px-2 text-[var(--text-muted)] text-right select-none">{d.lineNum}</span>
                                                <pre className="flex-1 px-2 whitespace-pre-wrap">{d.lineA}</pre>
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {computeDiff.map((d, i) => (
                                            <div key={i} className={`flex ${d.type === 'added' || d.type === 'modified' ? 'bg-green-500/20' : ''}`}>
                                                <span className="w-8 px-2 text-[var(--text-muted)] text-right select-none">{d.lineNum}</span>
                                                <pre className="flex-1 px-2 whitespace-pre-wrap">{d.lineB}</pre>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CodeDiff;
