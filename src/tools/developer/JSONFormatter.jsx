import { useState } from 'react';
import { Copy, Check, AlertTriangle, RotateCcw, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const JSONFormatter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [indentSize, setIndentSize] = useState(2);
    const { toast } = useToast();

    const formatJSON = () => {
        if (!input.trim()) {
            toast.warning('Please enter JSON to format');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, indentSize);
            setOutput(formatted);
            setError('');
            toast.success('JSON formatted successfully');
        } catch (e) {
            setError(e.message);
            setOutput('');
            toast.error('Invalid JSON');
        }
    };

    const minifyJSON = () => {
        if (!input.trim()) {
            toast.warning('Please enter JSON to minify');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            setOutput(minified);
            setError('');
            toast.success('JSON minified');
        } catch (e) {
            setError(e.message);
            setOutput('');
            toast.error('Invalid JSON');
        }
    };

    const validateJSON = () => {
        if (!input.trim()) {
            toast.warning('Please enter JSON to validate');
            return;
        }

        try {
            JSON.parse(input);
            setError('');
            toast.success('Valid JSON!');
        } catch (e) {
            setError(e.message);
            toast.error('Invalid JSON');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output || input);
        toast.success('Copied to clipboard');
    };

    const loadSample = () => {
        const sample = {
            "name": "KaamBox",
            "version": "1.0.0",
            "description": "Premium multi-tool webapp",
            "features": ["50+ tools", "client-side", "privacy-focused"],
            "author": {
                "name": "Developer",
                "website": "https://kaambox.com"
            },
            "settings": {
                "theme": "dark",
                "language": "en",
                "notifications": true
            }
        };
        setInput(JSON.stringify(sample));
        setOutput('');
        setError('');
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setError('');
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                <button onClick={formatJSON} className="btn-primary">
                    <Maximize2 size={18} />
                    Format
                </button>
                <button onClick={minifyJSON} className="btn-secondary">
                    <Minimize2 size={18} />
                    Minify
                </button>
                <button onClick={validateJSON} className="btn-secondary">
                    <Check size={18} />
                    Validate
                </button>
                <button onClick={loadSample} className="btn-secondary">
                    Load Sample
                </button>
                <button onClick={handleClear} className="btn-secondary">
                    <RotateCcw size={18} />
                    Clear
                </button>

                {/* Indent Size */}
                <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-[var(--text-muted)]">Indent:</span>
                    <select
                        value={indentSize}
                        onChange={(e) => setIndentSize(parseInt(e.target.value))}
                        className="input-field !py-2 !px-3 !w-auto"
                    >
                        <option value={2}>2 spaces</option>
                        <option value={4}>4 spaces</option>
                        <option value={8}>8 spaces</option>
                    </select>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-red-500">JSON Error</p>
                        <p className="text-sm text-red-400 mt-1 font-mono">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Input JSON
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder='{"key": "value"}'
                        className="textarea-field !min-h-[400px] !font-mono !text-sm"
                        spellCheck={false}
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        {input.length} characters
                    </p>
                </div>

                {/* Output */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Formatted Output
                        </label>
                        {output && (
                            <button onClick={handleCopy} className="btn-secondary !py-1 !px-2 text-xs">
                                <Copy size={14} />
                                Copy
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <pre className="bg-[var(--bg-tertiary)] rounded-xl p-4 min-h-[400px] overflow-auto text-sm font-mono text-[var(--text-primary)]">
                            {output || (
                                <span className="text-[var(--text-muted)]">
                                    Formatted JSON will appear here...
                                </span>
                            )}
                        </pre>
                    </div>
                    {output && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                            {output.length} characters
                            {output.length !== input.length && (
                                <span className="ml-2">
                                    ({output.length > input.length ? '+' : ''}{output.length - input.length})
                                </span>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                    <strong>Tips:</strong> Paste your JSON in the input field, then click Format to prettify it.
                    Use Minify to remove all whitespace for production use.
                </p>
            </div>
        </div>
    );
};

export default JSONFormatter;
