import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, RefreshCw } from 'lucide-react';

const DateCalculator = () => {
    const [mode, setMode] = useState('difference'); // difference or add
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [addDays, setAddDays] = useState(0);
    const [addMonths, setAddMonths] = useState(0);
    const [addYears, setAddYears] = useState(0);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate1(today);
        setDate2(today);
    }, []);

    const calculateDifference = () => {
        if (!date1 || !date2) return;

        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        const days = diffDays % 30;

        const weeks = Math.floor(diffDays / 7);
        const hours = diffDays * 24;
        const minutes = hours * 60;

        setResult({
            total: diffDays,
            years,
            months,
            days,
            weeks,
            hours,
            minutes
        });
    };

    const calculateAddSubtract = () => {
        if (!date1) return;

        const d = new Date(date1);
        d.setFullYear(d.getFullYear() + addYears);
        d.setMonth(d.getMonth() + addMonths);
        d.setDate(d.getDate() + addDays);

        setResult({
            resultDate: d.toISOString().split('T')[0],
            formattedDate: d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
    };

    const calculate = () => {
        if (mode === 'difference') {
            calculateDifference();
        } else {
            calculateAddSubtract();
        }
    };

    const setToday = (which) => {
        const today = new Date().toISOString().split('T')[0];
        if (which === 1) setDate1(today);
        else setDate2(today);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Date Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate difference between dates or add/subtract days</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => { setMode('difference'); setResult(null); }}
                        className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'difference' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        Date Difference
                    </button>
                    <button
                        onClick={() => { setMode('add'); setResult(null); }}
                        className={`flex-1 py-2 rounded-lg transition-colors ${mode === 'add' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        Add/Subtract
                    </button>
                </div>

                {mode === 'difference' ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Start Date</label>
                                    <button onClick={() => setToday(1)} className="text-xs text-[var(--accent-primary)]">Today</button>
                                </div>
                                <input
                                    type="date"
                                    value={date1}
                                    onChange={(e) => setDate1(e.target.value)}
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">End Date</label>
                                    <button onClick={() => setToday(2)} className="text-xs text-[var(--accent-primary)]">Today</button>
                                </div>
                                <input
                                    type="date"
                                    value={date2}
                                    onChange={(e) => setDate2(e.target.value)}
                                    className="input w-full"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <button onClick={() => setToday(1)} className="text-xs text-[var(--accent-primary)]">Today</button>
                            </div>
                            <input
                                type="date"
                                value={date1}
                                onChange={(e) => setDate1(e.target.value)}
                                className="input w-full"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-center">Years</label>
                                <input
                                    type="number"
                                    value={addYears}
                                    onChange={(e) => setAddYears(parseInt(e.target.value) || 0)}
                                    className="input w-full text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-center">Months</label>
                                <input
                                    type="number"
                                    value={addMonths}
                                    onChange={(e) => setAddMonths(parseInt(e.target.value) || 0)}
                                    className="input w-full text-center"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-center">Days</label>
                                <input
                                    type="number"
                                    value={addDays}
                                    onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                                    className="input w-full text-center"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] text-center">
                            Use negative numbers to subtract
                        </p>
                    </>
                )}

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={calculate}
                    className="btn-primary w-full"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Calculate
                </motion.button>

                {result && mode === 'difference' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl"
                    >
                        <div className="text-center mb-6">
                            <p className="text-4xl font-bold">{result.total}</p>
                            <p className="text-[var(--text-muted)]">Total Days</p>
                        </div>

                        <div className="text-center mb-4">
                            <p className="text-lg">
                                {result.years > 0 && <span className="text-blue-400">{result.years} years </span>}
                                {result.months > 0 && <span className="text-purple-400">{result.months} months </span>}
                                <span className="text-green-400">{result.days} days</span>
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-xl font-bold">{result.weeks}</p>
                                <p className="text-xs text-[var(--text-muted)]">Weeks</p>
                            </div>
                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-xl font-bold">{result.hours.toLocaleString()}</p>
                                <p className="text-xs text-[var(--text-muted)]">Hours</p>
                            </div>
                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <p className="text-xl font-bold">{result.minutes.toLocaleString()}</p>
                                <p className="text-xs text-[var(--text-muted)]">Minutes</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {result && mode === 'add' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl text-center"
                    >
                        <p className="text-sm text-[var(--text-muted)] mb-2">Result Date</p>
                        <p className="text-3xl font-bold mb-2">{result.resultDate}</p>
                        <p className="text-[var(--text-muted)]">{result.formattedDate}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DateCalculator;
