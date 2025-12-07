import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Plus, Trash2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [type, setType] = useState('expense');

    const categories = [
        { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
        { id: 'transport', name: 'Transport', icon: '🚗', color: '#f59e0b' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
        { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#ec4899' },
        { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#3b82f6' },
        { id: 'health', name: 'Health', icon: '💊', color: '#10b981' },
        { id: 'salary', name: 'Salary', icon: '💰', color: '#22c55e' },
        { id: 'other', name: 'Other', icon: '📦', color: '#6b7280' }
    ];

    useEffect(() => {
        const saved = localStorage.getItem('expenseTracker');
        if (saved) {
            setExpenses(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('expenseTracker', JSON.stringify(expenses));
    }, [expenses]);

    const addExpense = () => {
        if (!description || !amount) return;

        const newExpense = {
            id: Date.now(),
            description,
            amount: parseFloat(amount),
            category,
            type,
            date: new Date().toISOString()
        };

        setExpenses([newExpense, ...expenses]);
        setDescription('');
        setAmount('');
    };

    const deleteExpense = (id) => {
        setExpenses(expenses.filter(e => e.id !== id));
    };

    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    const expensesByCategory = categories.map(cat => ({
        ...cat,
        total: expenses.filter(e => e.category === cat.id && e.type === 'expense').reduce((sum, e) => sum + e.amount, 0)
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Expense Tracker</h2>
                <p className="text-[var(--text-muted)] text-sm">Track your income and expenses</p>
            </div>

            <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 bg-green-500/20 rounded-xl text-center">
                        <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
                        <p className="text-lg font-bold text-green-500">${totalIncome.toFixed(2)}</p>
                        <p className="text-xs text-[var(--text-muted)]">Income</p>
                    </div>
                    <div className="p-4 bg-red-500/20 rounded-xl text-center">
                        <TrendingDown className="w-5 h-5 mx-auto mb-1 text-red-500" />
                        <p className="text-lg font-bold text-red-500">${totalExpense.toFixed(2)}</p>
                        <p className="text-xs text-[var(--text-muted)]">Expenses</p>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
                        <Wallet className={`w-5 h-5 mx-auto mb-1 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
                        <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
                            ${Math.abs(balance).toFixed(2)}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">Balance</p>
                    </div>
                </div>

                {/* Add New */}
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-[var(--bg-secondary)]'
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 rounded-lg text-sm transition-colors ${type === 'income' ? 'bg-green-500 text-white' : 'bg-[var(--bg-secondary)]'
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description..."
                            className="input flex-1"
                        />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount"
                            className="input w-24"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`px-2 py-1 text-xs rounded-lg transition-colors ${category === cat.id ? 'ring-2 ring-[var(--accent-primary)]' : ''
                                    }`}
                                style={{ backgroundColor: cat.color + '30' }}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={addExpense}
                        className="btn-primary w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add {type === 'income' ? 'Income' : 'Expense'}
                    </motion.button>
                </div>

                {/* Category Breakdown */}
                {expensesByCategory.length > 0 && (
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2">
                            <PieChart className="w-4 h-4" /> Spending by Category
                        </p>
                        <div className="space-y-2">
                            {expensesByCategory.slice(0, 5).map(cat => (
                                <div key={cat.id} className="flex items-center gap-2">
                                    <span>{cat.icon}</span>
                                    <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(cat.total / totalExpense) * 100}%`,
                                                backgroundColor: cat.color
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm w-20 text-right">${cat.total.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {expenses.slice(0, 20).map(expense => {
                        const cat = categories.find(c => c.id === expense.category);
                        return (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <span className="text-xl">{cat?.icon}</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{expense.description}</p>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`font-bold ${expense.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    {expense.type === 'income' ? '+' : '-'}${expense.amount.toFixed(2)}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteExpense(expense.id)}
                                    className="p-1 rounded hover:bg-red-500/20 text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
