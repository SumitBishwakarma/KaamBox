import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, DollarSign, Percent, TrendingUp } from 'lucide-react';

const InvestmentCalculator = () => {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(8);
    const [time, setTime] = useState(10);
    const [compound, setCompound] = useState('yearly');
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [result, setResult] = useState(null);

    const compoundOptions = [
        { value: 'yearly', name: 'Annually', n: 1 },
        { value: 'semi', name: 'Semi-Annually', n: 2 },
        { value: 'quarterly', name: 'Quarterly', n: 4 },
        { value: 'monthly', name: 'Monthly', n: 12 },
        { value: 'daily', name: 'Daily', n: 365 }
    ];

    const calculate = () => {
        const P = principal;
        const r = rate / 100;
        const t = time;
        const n = compoundOptions.find(c => c.value === compound).n;
        const PMT = monthlyContribution;

        // Compound interest formula: A = P(1 + r/n)^(nt) + PMT[((1 + r/n)^(nt) - 1) / (r/n)]
        const compoundFactor = Math.pow(1 + r / n, n * t);

        let futureValue = P * compoundFactor;

        if (PMT > 0) {
            const monthlyRate = r / 12;
            const totalMonths = t * 12;
            const futureValueContributions = PMT * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
            futureValue += futureValueContributions;
        }

        const totalContributions = P + (PMT * 12 * t);
        const interestEarned = futureValue - totalContributions;

        // Yearly breakdown
        const yearlyData = [];
        for (let year = 1; year <= t; year++) {
            const yearCompound = Math.pow(1 + r / n, n * year);
            let yearValue = P * yearCompound;

            if (PMT > 0) {
                const monthlyRate = r / 12;
                const months = year * 12;
                yearValue += PMT * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
            }

            yearlyData.push({
                year,
                value: yearValue,
                contributions: P + (PMT * 12 * year)
            });
        }

        setResult({
            futureValue,
            totalContributions,
            interestEarned,
            yearlyData
        });
    };

    useEffect(() => {
        calculate();
    }, [principal, rate, time, compound, monthlyContribution]);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Investment Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate compound interest and future value</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Initial Investment</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="number"
                                value={principal}
                                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                                className="input w-full pl-9"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Monthly Contribution</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="number"
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                                className="input w-full pl-9"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
                        <div className="relative">
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="number"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                                className="input w-full pr-9"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Time Period (Years)</label>
                        <input
                            type="number"
                            value={time}
                            onChange={(e) => setTime(parseInt(e.target.value) || 1)}
                            className="input w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Compound Frequency</label>
                    <div className="flex flex-wrap gap-2">
                        {compoundOptions.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setCompound(opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${compound === opt.value ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl text-center">
                            <p className="text-sm text-[var(--text-muted)]">Future Value</p>
                            <p className="text-4xl font-bold text-green-400">${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-xl font-bold text-blue-400">${result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                <p className="text-sm text-[var(--text-muted)]">Total Invested</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-xl font-bold text-green-400">${result.interestEarned.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                <p className="text-sm text-[var(--text-muted)]">Interest Earned</p>
                            </div>
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                            <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Growth Over Time
                            </p>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {result.yearlyData.map(item => (
                                    <div key={item.year} className="flex items-center gap-2">
                                        <span className="w-12 text-sm text-[var(--text-muted)]">Year {item.year}</span>
                                        <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-4 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.value / result.futureValue) * 100}%` }}
                                                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                                            />
                                        </div>
                                        <span className="w-24 text-right text-sm font-mono">
                                            ${item.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default InvestmentCalculator;
