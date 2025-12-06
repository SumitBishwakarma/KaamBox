import { useState } from 'react';
import { Copy, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HTMLEncoder = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode');
    const { toast } = useToast();

    // HTML entity maps
    const encodeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    const decodeMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x27;': "'",
        '&#x2F;': '/',
        '&#47;': '/',
        '&#x60;': '`',
        '&#96;': '`',
        '&#x3D;': '=',
        '&#61;': '=',
        '&nbsp;': ' ',
        '&copy;': '\u00A9',
        '&reg;': '\u00AE',
        '&trade;': '\u2122',
        '&euro;': '\u20AC',
        '&pound;': '\u00A3',
        '&yen;': '\u00A5',
        '&cent;': '\u00A2',
        '&deg;': '\u00B0',
        '&plusmn;': '\u00B1',
        '&times;': '\u00D7',
        '&divide;': '\u00F7',
        '&frac12;': '\u00BD',
        '&frac14;': '\u00BC',
        '&frac34;': '\u00BE',
        '&hellip;': '\u2026',
        '&ndash;': '\u2013',
        '&mdash;': '\u2014',
        '&lsquo;': '\u2018',
        '&rsquo;': '\u2019',
        '&ldquo;': '\u201C',
        '&rdquo;': '\u201D',
        '&bull;': '\u2022',
        '&middot;': '\u00B7'
    };

    const encode = (text) => {
        return text.replace(/[&<>"'`=\/]/g, (char) => encodeMap[char] || char);
    };

    const decode = (text) => {
        let result = text;
        for (const [entity, char] of Object.entries(decodeMap)) {
            result = result.replaceAll(entity, char);
        }
        result = result.replace(/&#(\d+);/g, (match, num) =>
            String.fromCharCode(parseInt(num, 10))
        );
        result = result.replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) =>
            String.fromCharCode(parseInt(hex, 16))
        );
        return result;
    };

    const process = () => {
        if (!input.trim()) {
            toast.warning('Please enter text to process');
            return;
        }
        try {
            const result = mode === 'encode' ? encode(input) : decode(input);
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

    const commonEntities = [
        { char: '<', entity: '&lt;' },
        { char: '>', entity: '&gt;' },
        { char: '&', entity: '&amp;' },
        { char: '"', entity: '&quot;' },
        { char: "'", entity: '&#39;' },
        { char: ' ', entity: '&nbsp;' },
        { char: '\u00A9', entity: '&copy;' },
        { char: '\u00AE', entity: '&reg;' },
        { char: '\u2122', entity: '&trade;' },
        { char: '\u20AC', entity: '&euro;' },
        { char: '\u2026', entity: '&hellip;' },
        { char: '\u2014', entity: '&mdash;' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Mode
                </label>
                <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 max-w-xs">
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

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Input
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === 'encode'
                        ? '<div class="example">Hello & Welcome!</div>'
                        : '&lt;div class=&quot;example&quot;&gt;Hello &amp; Welcome!&lt;/div&gt;'
                    }
                    className="textarea-field !min-h-[150px] !font-mono"
                />
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={process} className="btn-primary flex-1 sm:flex-none">
                    {mode === 'encode' ? 'Encode HTML' : 'Decode HTML'}
                </button>
                {output && (
                    <button onClick={swap} className="btn-secondary">
                        <ArrowRightLeft size={18} />
                        Swap
                    </button>
                )}
                <button onClick={handleClear} className="btn-secondary">
                    <RotateCcw size={18} />
                    Clear
                </button>
            </div>

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
                        <pre className="font-mono text-sm text-[var(--text-primary)] whitespace-pre-wrap break-all">
                            {output}
                        </pre>
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Common HTML Entities
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {commonEntities.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center p-2 bg-[var(--bg-tertiary)] rounded-lg"
                        >
                            <span className="text-lg">{item.char === ' ' ? '\u2423' : item.char}</span>
                            <code className="text-xs text-[var(--text-muted)] mt-1">{item.entity}</code>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                    <strong>Tip:</strong> HTML encoding prevents XSS attacks by converting special characters into safe HTML entities.
                </p>
            </div>
        </div>
    );
};

export default HTMLEncoder;
