import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Calendar, TrendingUp } from 'lucide-react';

const SalaryCalculator = () => {
    const [amount, setAmount] = useState(50000);
    const [period, setPeriod] = useState('yearly');
    const [hoursPerWeek, setHoursPerWeek] = useState(40);
    const [weeksPerYear, setWeeksPerYear] = useState(52);
    const [results, setResults] = useState(null);

    const periods = [
        { value: 'hourly', name: 'Hourly', icon: '⏰' },
        { value: 'daily', name: 'Daily', icon: '📅' },
        { value: 'weekly', name: 'Weekly', icon: '📆' },
        { value: 'biweekly', name: 'Bi-Weekly', icon: '📆' },
        { value: 'monthly', name: 'Monthly', icon: '🗓️' },
        { value: 'yearly', name: 'Yearly', icon: '📊' }
    ];

    useEffect(() => {
        calculate();
    }, [amount, period, hoursPerWeek, weeksPerYear]);

    const calculate = () => {
        const hoursPerYear = hoursPerWeek * weeksPerYear;
        const daysPerYear = weeksPerYear * 5;

        let yearly;

        switch (period) {
            case 'hourly':
                yearly = amount * hoursPerYear;
                break;
            case 'daily':
                yearly = amount * daysPerYear;
                break;
            case 'weekly':
                yearly = amount * weeksPerYear;
                break;
            case 'biweekly':
                yearly = amount * (weeksPerYear / 2);
                break;
            case 'monthly':
                yearly = amount * 12;
                break;
            case 'yearly':
            default:
                yearly = amount;
                break;
        }

        setResults({
            hourly: yearly / hoursPerYear,
            daily: yearly / daysPerYear,
            weekly: yearly / weeksPerYear,
            biweekly: yearly / (weeksPerYear / 2),
            monthly: yearly / 12,
            yearly: yearly
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Salary Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Convert salary between different time periods</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Input Period</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {periods.map(p => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value)}
                                className={`p-2 rounded-lg text-xs text-center transition-colors ${period === p.value ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <span className="text-lg">{p.icon}</span>
                                <p>{p.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        {period.charAt(0).toUpperCase() + period.slice(1)} Amount
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="input w-full pl-10 text-2xl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Hours per Week</label>
                        <input
                            type="number"
                            value={hoursPerWeek}
                            onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 40)}
                            className="input w-full text-center"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Weeks per Year</label>
                        <input
                            type="number"
                            value={weeksPerYear}
                            onChange={(e) => setWeeksPerYear(parseInt(e.target.value) || 52)}
                            className="input w-full text-center"
                        />
                    </div>
                </div>

                {results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <p className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Salary Breakdown
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Object.entries(results).map(([key, value]) => (
                                <motion.div
                                    key={key}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-4 rounded-xl text-center ${key === period
                                            ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 ring-2 ring-[var(--accent-primary)]'
                                            : 'bg-[var(--bg-tertiary)]'
                                        }`}
                                >
                                    <p className="text-lg font-bold">{formatCurrency(value)}</p>
                                    <p className="text-xs text-[var(--text-muted)] capitalize">{key}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl mt-4">
                            <p className="text-sm text-[var(--text-muted)] text-center">
                                Based on {hoursPerWeek} hours/week × {weeksPerYear} weeks/year = {hoursPerWeek * weeksPerYear} hours/year
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SalaryCalculator;
