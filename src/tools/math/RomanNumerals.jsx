import { useState } from 'react';
import { ArrowLeftRight, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const RomanNumerals = () => {
    const [decimal, setDecimal] = useState('');
    const [roman, setRoman] = useState('');
    const [mode, setMode] = useState('toRoman'); // 'toRoman' or 'toDecimal'
    const { toast } = useToast();

    const romanValues = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    const toRoman = (num) => {
        if (num < 1 || num > 3999) return '';
        let result = '';
        let remaining = num;

        for (const { value, numeral } of romanValues) {
            while (remaining >= value) {
                result += numeral;
                remaining -= value;
            }
        }
        return result;
    };

    const toDecimal = (str) => {
        const romanMap = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let result = 0;
        const upper = str.toUpperCase();

        for (let i = 0; i < upper.length; i++) {
            const current = romanMap[upper[i]];
            const next = romanMap[upper[i + 1]];

            if (!current) return NaN;

            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }
        return result;
    };

    const handleDecimalChange = (value) => {
        setDecimal(value);
        const num = parseInt(value);
        if (!isNaN(num) && num >= 1 && num <= 3999) {
            setRoman(toRoman(num));
        } else {
            setRoman('');
        }
    };

    const handleRomanChange = (value) => {
        setRoman(value.toUpperCase());
        const num = toDecimal(value);
        if (!isNaN(num) && num > 0) {
            setDecimal(num.toString());
        } else {
            setDecimal('');
        }
    };

    const swapMode = () => {
        setMode(mode === 'toRoman' ? 'toDecimal' : 'toRoman');
    };

    const copyResult = () => {
        const text = mode === 'toRoman' ? roman : decimal;
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const examples = [
        { dec: 1, rom: 'I' },
        { dec: 4, rom: 'IV' },
        { dec: 9, rom: 'IX' },
        { dec: 42, rom: 'XLII' },
        { dec: 99, rom: 'XCIX' },
        { dec: 500, rom: 'D' },
        { dec: 1999, rom: 'MCMXCIX' },
        { dec: 2024, rom: 'MMXXIV' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setMode('toRoman')}
                    className={`p-4 rounded-xl border-2 transition-colors ${mode === 'toRoman'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-[var(--border-primary)] hover:border-blue-500/50'
                        }`}
                >
                    <p className="font-medium">Decimal → Roman</p>
                    <p className="text-xs text-[var(--text-muted)]">123 → CXXIII</p>
                </button>
                <button
                    onClick={() => setMode('toDecimal')}
                    className={`p-4 rounded-xl border-2 transition-colors ${mode === 'toDecimal'
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-[var(--border-primary)] hover:border-purple-500/50'
                        }`}
                >
                    <p className="font-medium">Roman → Decimal</p>
                    <p className="text-xs text-[var(--text-muted)]">CXXIII → 123</p>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Decimal Number (1-3999)
                    </label>
                    <input
                        type="number"
                        value={decimal}
                        onChange={(e) => handleDecimalChange(e.target.value)}
                        placeholder="Enter number"
                        className="input-field text-xl"
                        min="1"
                        max="3999"
                        disabled={mode === 'toDecimal'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Roman Numeral
                    </label>
                    <input
                        type="text"
                        value={roman}
                        onChange={(e) => handleRomanChange(e.target.value)}
                        placeholder="Enter roman numeral"
                        className="input-field text-xl font-serif"
                        disabled={mode === 'toRoman'}
                    />
                </div>
            </div>

            <div className="flex justify-center gap-3">
                <button onClick={swapMode} className="btn-secondary">
                    <ArrowLeftRight size={18} />
                    Swap Mode
                </button>
                <button
                    onClick={copyResult}
                    className="btn-secondary"
                    disabled={mode === 'toRoman' ? !roman : !decimal}
                >
                    <Copy size={18} />
                    Copy Result
                </button>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">Roman Numeral Reference</h4>
                <div className="grid grid-cols-7 gap-2 text-center">
                    {[
                        { r: 'I', d: 1 },
                        { r: 'V', d: 5 },
                        { r: 'X', d: 10 },
                        { r: 'L', d: 50 },
                        { r: 'C', d: 100 },
                        { r: 'D', d: 500 },
                        { r: 'M', d: 1000 }
                    ].map(({ r, d }) => (
                        <div key={r} className="p-2 bg-[var(--bg-secondary)] rounded-lg">
                            <p className="text-xl font-serif font-bold text-blue-400">{r}</p>
                            <p className="text-xs text-[var(--text-muted)]">{d}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-medium mb-3">Examples</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {examples.map(({ dec, rom }) => (
                        <button
                            key={dec}
                            onClick={() => handleDecimalChange(dec.toString())}
                            className="p-3 bg-[var(--bg-tertiary)] hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                            <p className="font-mono text-blue-400">{dec}</p>
                            <p className="font-serif text-sm">{rom}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RomanNumerals;
