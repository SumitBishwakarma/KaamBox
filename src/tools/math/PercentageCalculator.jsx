import { useState } from 'react';
import { Percent, Copy } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PercentageCalculator = () => {
    const { toast } = useToast();

    // Mode 1: What is X% of Y?
    const [percent1, setPercent1] = useState('');
    const [number1, setNumber1] = useState('');

    // Mode 2: X is what % of Y?
    const [value2, setValue2] = useState('');
    const [total2, setTotal2] = useState('');

    // Mode 3: % change from X to Y
    const [original3, setOriginal3] = useState('');
    const [newValue3, setNewValue3] = useState('');

    // Mode 4: Increase/Decrease X by Y%
    const [number4, setNumber4] = useState('');
    const [percent4, setPercent4] = useState('');

    const calculate1 = () => {
        const p = parseFloat(percent1);
        const n = parseFloat(number1);
        if (isNaN(p) || isNaN(n)) return null;
        return (p / 100) * n;
    };

    const calculate2 = () => {
        const v = parseFloat(value2);
        const t = parseFloat(total2);
        if (isNaN(v) || isNaN(t) || t === 0) return null;
        return (v / t) * 100;
    };

    const calculate3 = () => {
        const o = parseFloat(original3);
        const n = parseFloat(newValue3);
        if (isNaN(o) || isNaN(n) || o === 0) return null;
        return ((n - o) / o) * 100;
    };

    const calculate4Increase = () => {
        const n = parseFloat(number4);
        const p = parseFloat(percent4);
        if (isNaN(n) || isNaN(p)) return null;
        return n * (1 + p / 100);
    };

    const calculate4Decrease = () => {
        const n = parseFloat(number4);
        const p = parseFloat(percent4);
        if (isNaN(n) || isNaN(p)) return null;
        return n * (1 - p / 100);
    };

    const formatResult = (value) => {
        if (value === null) return '—';
        return value.toFixed(4).replace(/\.?0+$/, '');
    };

    const copyResult = (value) => {
        if (value !== null) {
            navigator.clipboard.writeText(value.toString());
            toast.success('Copied to clipboard');
        }
    };

    const ResultDisplay = ({ label, value, unit = '' }) => (
        <div
            className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl cursor-pointer hover:bg-blue-500/20 transition-colors"
            onClick={() => copyResult(value)}
        >
            <span className="text-[var(--text-muted)]">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-400">
                    {formatResult(value)}{unit}
                </span>
                <Copy size={16} className="text-blue-400/50" />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Mode 1: What is X% of Y? */}
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Percent size={20} className="text-blue-500" />
                    What is X% of Y?
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--text-muted)]">What is</span>
                    <input
                        type="number"
                        value={percent1}
                        onChange={(e) => setPercent1(e.target.value)}
                        className="input-field !w-24 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">% of</span>
                    <input
                        type="number"
                        value={number1}
                        onChange={(e) => setNumber1(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">?</span>
                </div>
                <ResultDisplay label="Result" value={calculate1()} />
            </div>

            {/* Mode 2: X is what % of Y? */}
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Percent size={20} className="text-green-500" />
                    X is what % of Y?
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="number"
                        value={value2}
                        onChange={(e) => setValue2(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">is what % of</span>
                    <input
                        type="number"
                        value={total2}
                        onChange={(e) => setTotal2(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">?</span>
                </div>
                <ResultDisplay label="Result" value={calculate2()} unit="%" />
            </div>

            {/* Mode 3: Percentage Change */}
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Percent size={20} className="text-purple-500" />
                    Percentage Change
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[var(--text-muted)]">From</span>
                    <input
                        type="number"
                        value={original3}
                        onChange={(e) => setOriginal3(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">to</span>
                    <input
                        type="number"
                        value={newValue3}
                        onChange={(e) => setNewValue3(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                </div>
                <div
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${calculate3() !== null && calculate3() >= 0
                            ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20'
                            : 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                        }`}
                    onClick={() => copyResult(calculate3())}
                >
                    <span className="text-[var(--text-muted)]">
                        {calculate3() !== null && calculate3() >= 0 ? 'Increase' : 'Decrease'}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${calculate3() !== null && calculate3() >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {calculate3() !== null ? (calculate3() >= 0 ? '+' : '') : ''}{formatResult(calculate3())}%
                        </span>
                        <Copy size={16} className="opacity-50" />
                    </div>
                </div>
            </div>

            {/* Mode 4: Increase/Decrease by % */}
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-2xl space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                    <Percent size={20} className="text-orange-500" />
                    Increase/Decrease by Percentage
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="number"
                        value={number4}
                        onChange={(e) => setNumber4(e.target.value)}
                        className="input-field !w-32 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">by</span>
                    <input
                        type="number"
                        value={percent4}
                        onChange={(e) => setPercent4(e.target.value)}
                        className="input-field !w-24 text-center"
                        placeholder="0"
                    />
                    <span className="text-[var(--text-muted)]">%</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div
                        className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/30 rounded-xl cursor-pointer hover:bg-green-500/20 transition-colors"
                        onClick={() => copyResult(calculate4Increase())}
                    >
                        <span className="text-green-400">+ Increase</span>
                        <span className="text-lg font-bold text-green-400">
                            {formatResult(calculate4Increase())}
                        </span>
                    </div>
                    <div
                        className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-xl cursor-pointer hover:bg-red-500/20 transition-colors"
                        onClick={() => copyResult(calculate4Decrease())}
                    >
                        <span className="text-red-400">- Decrease</span>
                        <span className="text-lg font-bold text-red-400">
                            {formatResult(calculate4Decrease())}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tip */}
            <p className="text-center text-sm text-[var(--text-muted)]">
                Click on any result to copy it to clipboard
            </p>
        </div>
    );
};

export default PercentageCalculator;
