import { useState } from 'react';
import { Copy, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const URLEncoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // encode or decode
    const [encodeType, setEncodeType] = useState('component'); // component or full
    const { toast } = useToast();

    const process = () => {
        if (!input.trim()) {
            toast.warning('Please enter text to process');
            return;
        }

        try {
            let result;
            if (mode === 'encode') {
                result = encodeType === 'component'
                    ? encodeURIComponent(input)
                    : encodeURI(input);
            } else {
                result = encodeType === 'component'
                    ? decodeURIComponent(input)
                    : decodeURI(input);
            }
            setOutput(result);
            toast.success(`${mode === 'encode' ? 'Encoded' : 'Decoded'} successfully`);
        } catch (e) {
            toast.error(`Failed to ${mode}: ${e.message}`);
        }
    };

    const swap = () => {
        setInput(output);
        setOutput('');
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    return (
        <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Mode
                    </label>
                    <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                        <button
                            onClick={() => setMode('encode')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'encode'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode('decode')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === 'decode'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Encode Type
                    </label>
                    <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1">
                        <button
                            onClick={() => setEncodeType('component')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${encodeType === 'component'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Component
                        </button>
                        <button
                            onClick={() => setEncodeType('full')}
                            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${encodeType === 'full'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Full URI
                        </button>
                    </div>
                </div>
            </div>

            {/* Input */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Input
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode'
                        ? 'Enter text or URL to encode...'
                        : 'Enter encoded URL to decode...'
                    }
                    className="textarea-field !min-h-[120px]"
                />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button onClick={process} className="btn-primary flex-1 sm:flex-none">
                    {mode === 'encode' ? 'Encode' : 'Decode'}
                </button>
                {output && (
                    <button onClick={swap} className="btn-secondary">
                        <ArrowRightLeft size={18} />
                        Swap & {mode === 'encode' ? 'Decode' : 'Encode'}
                    </button>
                )}
                <button onClick={handleClear} className="btn-secondary">
                    <RotateCcw size={18} />
                    Clear
                </button>
            </div>

            {/* Output */}
            {output && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Output
                        </label>
                        <button onClick={handleCopy} className="btn-secondary !py-1 !px-2 text-xs">
                            <Copy size={14} />
                            Copy
                        </button>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                        <p className="font-mono text-sm text-[var(--text-primary)] break-all">
                            {output}
                        </p>
                    </div>
                </div>
            )}

            {/* Examples */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="font-medium text-blue-400 mb-2">Difference:</h4>
                <ul className="text-sm text-blue-300 space-y-2">
                    <li>
                        <strong>encodeURIComponent:</strong> Encodes special characters including <code className="bg-blue-500/20 px-1 rounded">: / ? # @ & = + $</code>
                        <br />
                        <span className="text-blue-400/70">Use for: Query parameters, form data</span>
                    </li>
                    <li>
                        <strong>encodeURI:</strong> Keeps URL structure characters intact
                        <br />
                        <span className="text-blue-400/70">Use for: Complete URLs</span>
                    </li>
                </ul>
            </div>

            {/* Quick Examples */}
            <div>
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Try these:</h4>
                <div className="flex flex-wrap gap-2">
                    {[
                        'Hello World!',
                        'user@email.com',
                        'https://example.com/path?name=John Doe&city=New York',
                        'key=value&foo=bar baz',
                        '你好世界'
                    ].map((example) => (
                        <button
                            key={example}
                            onClick={() => setInput(example)}
                            className="px-3 py-1.5 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-sm"
                        >
                            {example.length > 30 ? example.substring(0, 30) + '...' : example}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default URLEncoder;
