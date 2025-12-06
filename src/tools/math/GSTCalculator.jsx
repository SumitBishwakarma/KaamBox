import { useState } from 'react';
import { Calculator as CalcIcon, Plus, Minus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const GSTCalculator = () => {
    const [amount, setAmount] = useState('');
    const [gstRate, setGstRate] = useState(18);
    const [mode, setMode] = useState('add'); // 'add' or 'remove'
    const { toast } = useToast();

    const calculate = () => {
        const num = parseFloat(amount) || 0;
        if (num === 0) return null;

        if (mode === 'add') {
            const gstAmount = (num * gstRate) / 100;
            const total = num + gstAmount;
            return {
                original: num,
                gst: gstAmount,
                total: total,
                label: 'Total (incl. GST)'
            };
        } else {
            const original = (num * 100) / (100 + gstRate);
            const gstAmount = num - original;
            return {
                original: original,
                gst: gstAmount,
                total: num,
                label: 'Original Price'
            };
        }
    };

    const result = calculate();

    const formatCurrency = (num) => {
        return num.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const commonRates = [5, 12, 18, 28];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setMode('add')}
                    className={`p-4 rounded-xl border-2 transition-colors ${mode === 'add'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-[var(--border-primary)] hover:border-green-500/50'
                        }`}
                >
                    <Plus className="mx-auto mb-2 text-green-400" size={24} />
                    <p className="font-medium">Add GST</p>
                    <p className="text-xs text-[var(--text-muted)]">Calculate total with tax</p>
                </button>
                <button
                    onClick={() => setMode('remove')}
                    className={`p-4 rounded-xl border-2 transition-colors ${mode === 'remove'
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-[var(--border-primary)] hover:border-red-500/50'
                        }`}
                >
                    <Minus className="mx-auto mb-2 text-red-400" size={24} />
                    <p className="font-medium">Remove GST</p>
                    <p className="text-xs text-[var(--text-muted)]">Get original price</p>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        {mode === 'add' ? 'Original Amount' : 'Amount (incl. GST)'}
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="input-field pl-8 text-xl"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        GST Rate (%)
                    </label>
                    <input
                        type="number"
                        value={gstRate}
                        onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                        className="input-field text-xl"
                        min="0"
                        max="100"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Common GST Rates
                </label>
                <div className="flex gap-2">
                    {commonRates.map(rate => (
                        <button
                            key={rate}
                            onClick={() => setGstRate(rate)}
                            className={`px-4 py-2 rounded-lg transition-colors ${gstRate === rate
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-[var(--bg-tertiary)] hover:bg-blue-500/20'
                                }`}
                        >
                            {rate}%
                        </button>
                    ))}
                </div>
            </div>

            {result && (
                <div className="p-6 bg-[var(--bg-tertiary)] rounded-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)] mb-1">
                                {mode === 'add' ? 'Original Amount' : 'Original Price'}
                            </p>
                            <p className="text-2xl font-bold text-blue-400">
                                ₹{formatCurrency(result.original)}
                            </p>
                        </div>
                        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)] mb-1">GST ({gstRate}%)</p>
                            <p className="text-2xl font-bold text-yellow-400">
                                ₹{formatCurrency(result.gst)}
                            </p>
                        </div>
                        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                            <p className="text-sm text-[var(--text-muted)] mb-1">{result.label}</p>
                            <p className="text-2xl font-bold text-green-400">
                                ₹{formatCurrency(result.total)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                        <h4 className="font-medium mb-2">GST Breakdown</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-[var(--text-muted)]">CGST ({gstRate / 2}%): </span>
                                <span className="font-mono">₹{formatCurrency(result.gst / 2)}</span>
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)]">SGST ({gstRate / 2}%): </span>
                                <span className="font-mono">₹{formatCurrency(result.gst / 2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GSTCalculator;
