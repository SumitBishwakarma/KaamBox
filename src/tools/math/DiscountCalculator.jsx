import { useState } from 'react';
import { motion } from 'framer-motion';
import { Percent, Tag, ArrowRight } from 'lucide-react';

const DiscountCalculator = () => {
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [discountAmount, setDiscountAmount] = useState('');
    const [mode, setMode] = useState('percent'); // percent or amount

    const discountPresets = [5, 10, 15, 20, 25, 30, 40, 50, 75];

    const calculate = () => {
        const price = parseFloat(originalPrice) || 0;

        if (mode === 'percent') {
            const percent = parseFloat(discountPercent) || 0;
            const discount = (price * percent) / 100;
            return {
                discount,
                finalPrice: price - discount,
                savedPercent: percent
            };
        } else {
            const discount = parseFloat(discountAmount) || 0;
            return {
                discount,
                finalPrice: price - discount,
                savedPercent: price > 0 ? (discount / price) * 100 : 0
            };
        }
    };

    const result = calculate();

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Discount Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate discounted prices quickly</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Original Price</label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            placeholder="0.00"
                            className="input w-full pl-10 text-xl"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setMode('percent')}
                        className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'percent' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <Percent className="w-4 h-4 inline mr-2" />
                        Percentage
                    </button>
                    <button
                        onClick={() => setMode('amount')}
                        className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'amount' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        $ Fixed Amount
                    </button>
                </div>

                {mode === 'percent' ? (
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Percentage</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {discountPresets.map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => setDiscountPercent(preset.toString())}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${discountPercent === preset.toString() ? 'bg-red-500 text-white' : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    {preset}%
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                            <input
                                type="number"
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                                placeholder="0"
                                className="input w-full pr-10 text-xl"
                            />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-2">Discount Amount</label>
                        <input
                            type="number"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            placeholder="0.00"
                            className="input w-full text-xl"
                        />
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="text-center">
                            <p className="text-sm text-[var(--text-muted)]">Original</p>
                            <p className="text-2xl line-through text-red-400">${(parseFloat(originalPrice) || 0).toFixed(2)}</p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-[var(--text-muted)]" />
                        <div className="text-center">
                            <p className="text-sm text-[var(--text-muted)]">Final Price</p>
                            <p className="text-3xl font-bold text-green-400">${result.finalPrice.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                            <p className="text-2xl font-bold text-red-400">-${result.discount.toFixed(2)}</p>
                            <p className="text-sm text-[var(--text-muted)]">You Save</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                            <p className="text-2xl font-bold text-purple-400">{result.savedPercent.toFixed(1)}%</p>
                            <p className="text-sm text-[var(--text-muted)]">Discount</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DiscountCalculator;
