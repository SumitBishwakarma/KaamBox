import { useState } from 'react';
import { Copy, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const BinaryConverter = () => {
    const [text, setText] = useState('');
    const [binary, setBinary] = useState('');
    const [mode, setMode] = useState('textToBinary');
    const [separator, setSeparator] = useState('space'); // space, none, comma
    const { toast } = useToast();

    const textToBinary = (str) => {
        const sep = separator === 'space' ? ' ' : separator === 'comma' ? ', ' : '';
        return str.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(sep);
    };

    const binaryToText = (str) => {
        // Clean input - remove any non-binary characters except whitespace
        const cleaned = str.replace(/[^01\s,]/g, '');
        // Split by common separators
        const bytes = cleaned.split(/[\s,]+/).filter(b => b.length > 0);

        try {
            return bytes.map(byte => {
                const charCode = parseInt(byte, 2);
                if (isNaN(charCode)) return '?';
                return String.fromCharCode(charCode);
            }).join('');
        } catch (e) {
            return 'Error: Invalid binary';
        }
    };

    const handleConvert = () => {
        if (mode === 'textToBinary') {
            if (!text.trim()) {
                toast.warning('Please enter text to convert');
                return;
            }
            setBinary(textToBinary(text));
            toast.success('Converted to binary');
        } else {
            if (!binary.trim()) {
                toast.warning('Please enter binary to convert');
                return;
            }
            setText(binaryToText(binary));
            toast.success('Converted to text');
        }
    };

    const swap = () => {
        setMode(mode === 'textToBinary' ? 'binaryToText' : 'textToBinary');
    };

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard');
    };

    const handleClear = () => {
        setText('');
        setBinary('');
    };

    // Quick examples
    const examples = [
        { text: 'Hello', label: 'Hello' },
        { text: 'Hi!', label: 'Hi!' },
        { text: 'ABC', label: 'ABC' },
        { text: '123', label: '123' },
        { text: 'KaamBox', label: 'KaamBox' }
    ];

    return (
        <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                    <button
                        onClick={() => setMode('textToBinary')}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'textToBinary'
                                ? 'bg-blue-500 text-white'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        Text → Binary
                    </button>
                    <button
                        onClick={() => setMode('binaryToText')}
                        className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'binaryToText'
                                ? 'bg-blue-500 text-white'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        Binary → Text
                    </button>
                </div>

                {/* Separator Option */}
                {mode === 'textToBinary' && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-muted)]">Separator:</span>
                        <select
                            value={separator}
                            onChange={(e) => setSeparator(e.target.value)}
                            className="input-field !py-2 !px-3 !w-auto"
                        >
                            <option value="space">Space</option>
                            <option value="comma">Comma</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Input/Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Text Input */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Text
                        </label>
                        {text && (
                            <button
                                onClick={() => handleCopy(text)}
                                className="btn-secondary !py-1 !px-2 text-xs"
                            >
                                <Copy size={14} />
                            </button>
                        )}
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text here..."
                        className="textarea-field !min-h-[150px]"
                        disabled={mode === 'binaryToText'}
                    />
                </div>

                {/* Binary Output */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Binary
                        </label>
                        {binary && (
                            <button
                                onClick={() => handleCopy(binary)}
                                className="btn-secondary !py-1 !px-2 text-xs"
                            >
                                <Copy size={14} />
                            </button>
                        )}
                    </div>
                    <textarea
                        value={binary}
                        onChange={(e) => setBinary(e.target.value)}
                        placeholder="Binary will appear here..."
                        className="textarea-field !min-h-[150px] !font-mono"
                        disabled={mode === 'textToBinary'}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button onClick={handleConvert} className="btn-primary flex-1 sm:flex-none">
                    Convert
                </button>
                <button onClick={swap} className="btn-secondary">
                    <ArrowRightLeft size={18} />
                    Swap
                </button>
                <button onClick={handleClear} className="btn-secondary">
                    <RotateCcw size={18} />
                    Clear
                </button>
            </div>

            {/* Quick Examples */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Quick Examples
                </label>
                <div className="flex flex-wrap gap-2">
                    {examples.map((example) => (
                        <button
                            key={example.label}
                            onClick={() => {
                                setText(example.text);
                                setBinary(textToBinary(example.text));
                                setMode('textToBinary');
                            }}
                            className="px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm"
                        >
                            {example.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ASCII Table Reference */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="font-medium text-blue-400 mb-3">Common ASCII Binary Values</h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {['A', 'B', 'C', '0', '1', '2', '!', '@'].map((char) => (
                        <div key={char} className="text-center p-2 bg-blue-500/10 rounded-lg">
                            <p className="text-lg">{char}</p>
                            <p className="text-xs font-mono text-blue-400">
                                {char.charCodeAt(0).toString(2).padStart(8, '0')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="text-sm text-[var(--text-muted)]">
                <p>Each character is converted to its 8-bit binary representation using ASCII encoding.</p>
            </div>
        </div>
    );
};

export default BinaryConverter;
