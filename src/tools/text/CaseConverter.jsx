import { useState } from 'react';
import { Copy, RotateCcw, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CaseConverter = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [activeCase, setActiveCase] = useState(null);
    const { toast } = useToast();

    const caseOptions = [
        {
            id: 'upper',
            label: 'UPPERCASE',
            example: 'HELLO WORLD',
            transform: (text) => text.toUpperCase()
        },
        {
            id: 'lower',
            label: 'lowercase',
            example: 'hello world',
            transform: (text) => text.toLowerCase()
        },
        {
            id: 'title',
            label: 'Title Case',
            example: 'Hello World',
            transform: (text) => text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        },
        {
            id: 'sentence',
            label: 'Sentence case',
            example: 'Hello world. This is text.',
            transform: (text) => {
                return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
            }
        },
        {
            id: 'camel',
            label: 'camelCase',
            example: 'helloWorld',
            transform: (text) => {
                return text.toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
                    .replace(/^./, c => c.toLowerCase());
            }
        },
        {
            id: 'pascal',
            label: 'PascalCase',
            example: 'HelloWorld',
            transform: (text) => {
                return text.toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
                    .replace(/^./, c => c.toUpperCase());
            }
        },
        {
            id: 'snake',
            label: 'snake_case',
            example: 'hello_world',
            transform: (text) => {
                return text.toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-zA-Z0-9_]/g, '');
            }
        },
        {
            id: 'kebab',
            label: 'kebab-case',
            example: 'hello-world',
            transform: (text) => {
                return text.toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-zA-Z0-9-]/g, '');
            }
        },
        {
            id: 'constant',
            label: 'CONSTANT_CASE',
            example: 'HELLO_WORLD',
            transform: (text) => {
                return text.toUpperCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^A-Z0-9_]/g, '');
            }
        },
        {
            id: 'alternating',
            label: 'aLtErNaTiNg',
            example: 'hElLo WoRlD',
            transform: (text) => {
                return text.split('').map((c, i) =>
                    i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
                ).join('');
            }
        }
    ];

    const handleConvert = (option) => {
        if (!input.trim()) {
            toast.warning('Please enter some text first');
            return;
        }
        setActiveCase(option.id);
        setOutput(option.transform(input));
        toast.success(`Converted to ${option.label}`);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
        setActiveCase(null);
    };

    return (
        <div className="space-y-6">
            {/* Input */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                        Input Text
                    </label>
                    <button
                        onClick={handleClear}
                        disabled={!input && !output}
                        className="btn-secondary !py-1 !px-2 text-xs disabled:opacity-50"
                    >
                        <RotateCcw size={14} />
                        Clear
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to convert..."
                    className="textarea-field !min-h-[120px]"
                />
            </div>

            {/* Case Options Grid */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                    Select Case Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {caseOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleConvert(option)}
                            className={`
                p-3 rounded-xl border text-left transition-all
                ${activeCase === option.id
                                    ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                    : 'border-[var(--border-color)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-tertiary)]'}
              `}
                        >
                            <p className="font-medium text-sm">{option.label}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1 truncate">{option.example}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Output */}
            {output && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Converted Text
                        </label>
                        <button onClick={handleCopy} className="btn-secondary !py-2 !px-3 text-sm">
                            <Copy size={16} />
                            Copy
                        </button>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                        <p className="whitespace-pre-wrap text-[var(--text-primary)] font-mono">
                            {output}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseConverter;
