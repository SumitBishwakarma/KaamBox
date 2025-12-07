import { useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Calculator, DollarSign } from 'lucide-react';

const TipCalculator = () => {
    const [billAmount, setBillAmount] = useState('');
    const [tipPercentage, setTipPercentage] = useState(15);
    const [splitBy, setSplitBy] = useState(1);

    const tipPresets = [10, 15, 18, 20, 25, 30];

    const calculateTip = () => {
        const bill = parseFloat(billAmount) || 0;
        return (bill * tipPercentage) / 100;
    };

    const calculateTotal = () => {
        const bill = parseFloat(billAmount) || 0;
        return bill + calculateTip();
    };

    const calculatePerPerson = () => {
        return calculateTotal() / splitBy;
    };

    const tipAmount = calculateTip();
    const totalAmount = calculateTotal();
    const perPerson = calculatePerPerson();

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Tip Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate tips and split the bill</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Bill Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={billAmount}
                            onChange={(e) => setBillAmount(e.target.value)}
                            placeholder="0.00"
                            className="input w-full pl-10 text-2xl"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tip: {tipPercentage}%</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tipPresets.map(preset => (
                            <button
                                key={preset}
                                onClick={() => setTipPercentage(preset)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${tipPercentage === preset ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {preset}%
                            </button>
                        ))}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={tipPercentage}
                        onChange={(e) => setTipPercentage(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Split By: {splitBy} {splitBy === 1 ? 'person' : 'people'}</label>
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSplitBy(Math.max(1, splitBy - 1))}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            -
                        </motion.button>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={splitBy}
                            onChange={(e) => setSplitBy(Math.max(1, parseInt(e.target.value) || 1))}
                            className="input w-20 text-center text-xl"
                        />
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSplitBy(splitBy + 1)}
                            className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] text-2xl font-bold"
                        >
                            +
                        </motion.button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl space-y-4"
                >
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Bill Amount</span>
                        <span className="text-xl">${(parseFloat(billAmount) || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[var(--text-muted)]">Tip ({tipPercentage}%)</span>
                        <span className="text-xl text-green-400">${tipAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-[var(--bg-tertiary)] pt-4 flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
                    </div>
                    {splitBy > 1 && (
                        <div className="border-t border-[var(--bg-tertiary)] pt-4 flex justify-between items-center">
                            <span className="text-[var(--text-muted)]">Per Person ({splitBy})</span>
                            <span className="text-xl font-bold text-[var(--accent-primary)]">${perPerson.toFixed(2)}</span>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default TipCalculator;
