import { useState, useEffect } from 'react';
import { Calculator, PieChart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const LoanCalculator = () => {
    const [principal, setPrincipal] = useState(1000000);
    const [rate, setRate] = useState(10);
    const [tenure, setTenure] = useState(12);
    const [tenureType, setTenureType] = useState('months');
    const { toast } = useToast();

    const calculateEMI = () => {
        const months = tenureType === 'years' ? tenure * 12 : tenure;
        const monthlyRate = rate / 12 / 100;

        if (monthlyRate === 0) {
            return {
                emi: principal / months,
                totalInterest: 0,
                totalAmount: principal,
                months
            };
        }

        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmount = emi * months;
        const totalInterest = totalAmount - principal;

        return {
            emi,
            totalInterest,
            totalAmount,
            months
        };
    };

    const result = calculateEMI();

    const formatCurrency = (num) => {
        return num.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    };

    const getAmortizationSchedule = () => {
        const months = result.months;
        const monthlyRate = rate / 12 / 100;
        let balance = principal;
        const schedule = [];

        for (let i = 1; i <= Math.min(months, 12); i++) {
            const interest = balance * monthlyRate;
            const principalPaid = result.emi - interest;
            balance -= principalPaid;

            schedule.push({
                month: i,
                emi: result.emi,
                principal: principalPaid,
                interest: interest,
                balance: Math.max(0, balance)
            });
        }

        return schedule;
    };

    const principalPercent = (principal / result.totalAmount * 100).toFixed(1);
    const interestPercent = (result.totalInterest / result.totalAmount * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Loan Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={principal}
                        onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                        className="input-field"
                        min="0"
                    />
                    <input
                        type="range"
                        min="10000"
                        max="10000000"
                        step="10000"
                        value={principal}
                        onChange={(e) => setPrincipal(parseInt(e.target.value))}
                        className="w-full mt-2 accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Interest Rate (% p.a.)
                    </label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                        className="input-field"
                        min="0"
                        max="50"
                        step="0.1"
                    />
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full mt-2 accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Loan Tenure
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={tenure}
                            onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
                            className="input-field flex-1"
                            min="1"
                        />
                        <select
                            value={tenureType}
                            onChange={(e) => setTenureType(e.target.value)}
                            className="input-field !w-24"
                        >
                            <option value="months">Months</option>
                            <option value="years">Years</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-center">
                <p className="text-sm text-[var(--text-muted)] mb-2">Monthly EMI</p>
                <p className="text-4xl font-bold">₹{formatCurrency(result.emi)}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-[var(--text-muted)] text-sm mb-1">Principal Amount</p>
                    <p className="text-2xl font-bold text-blue-400">₹{formatCurrency(principal)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{principalPercent}%</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-[var(--text-muted)] text-sm mb-1">Total Interest</p>
                    <p className="text-2xl font-bold text-red-400">₹{formatCurrency(result.totalInterest)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{interestPercent}%</p>
                </div>
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                    <p className="text-[var(--text-muted)] text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-green-400">₹{formatCurrency(result.totalAmount)}</p>
                    <p className="text-xs text-[var(--text-muted)]">{result.months} months</p>
                </div>
            </div>

            {/* Visual breakdown */}
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">Payment Breakdown</h4>
                <div className="h-8 rounded-full overflow-hidden flex">
                    <div
                        className="bg-blue-500 transition-all"
                        style={{ width: `${principalPercent}%` }}
                    />
                    <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${interestPercent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-500 rounded" />
                        Principal ({principalPercent}%)
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded" />
                        Interest ({interestPercent}%)
                    </span>
                </div>
            </div>

            {/* First year schedule */}
            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <h4 className="font-medium mb-3">First Year Schedule</h4>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[var(--text-muted)] border-b border-[var(--border-primary)]">
                                <th className="text-left py-2">Month</th>
                                <th className="text-right py-2">EMI</th>
                                <th className="text-right py-2">Principal</th>
                                <th className="text-right py-2">Interest</th>
                                <th className="text-right py-2">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getAmortizationSchedule().map((row) => (
                                <tr key={row.month} className="border-b border-[var(--border-primary)]/50">
                                    <td className="py-2">{row.month}</td>
                                    <td className="text-right font-mono">₹{formatCurrency(row.emi)}</td>
                                    <td className="text-right font-mono text-blue-400">₹{formatCurrency(row.principal)}</td>
                                    <td className="text-right font-mono text-red-400">₹{formatCurrency(row.interest)}</td>
                                    <td className="text-right font-mono">₹{formatCurrency(row.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoanCalculator;
