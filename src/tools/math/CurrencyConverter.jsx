import { useState, useEffect } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [result, setResult] = useState(null);
    const [rates, setRates] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Fallback exchange rates (as of late 2024)
    const fallbackRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        INR: 83.5,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.24,
        BRL: 4.97,
        RUB: 92.5,
        KRW: 1320,
        SGD: 1.34,
        HKD: 7.82,
        MXN: 17.2,
        ZAR: 18.5,
        AED: 3.67,
        SAR: 3.75,
        THB: 35.5,
        PHP: 55.8,
        MYR: 4.72,
        IDR: 15600,
        VND: 24500,
        BDT: 110,
        PKR: 285,
        NPR: 133,
        LKR: 325
    };

    const currencies = Object.keys(fallbackRates);

    const currencyNames = {
        USD: 'US Dollar',
        EUR: 'Euro',
        GBP: 'British Pound',
        JPY: 'Japanese Yen',
        INR: 'Indian Rupee',
        AUD: 'Australian Dollar',
        CAD: 'Canadian Dollar',
        CHF: 'Swiss Franc',
        CNY: 'Chinese Yuan',
        BRL: 'Brazilian Real',
        RUB: 'Russian Ruble',
        KRW: 'South Korean Won',
        SGD: 'Singapore Dollar',
        HKD: 'Hong Kong Dollar',
        MXN: 'Mexican Peso',
        ZAR: 'South African Rand',
        AED: 'UAE Dirham',
        SAR: 'Saudi Riyal',
        THB: 'Thai Baht',
        PHP: 'Philippine Peso',
        MYR: 'Malaysian Ringgit',
        IDR: 'Indonesian Rupiah',
        VND: 'Vietnamese Dong',
        BDT: 'Bangladeshi Taka',
        PKR: 'Pakistani Rupee',
        NPR: 'Nepalese Rupee',
        LKR: 'Sri Lankan Rupee'
    };

    useEffect(() => {
        setRates(fallbackRates);
    }, []);

    useEffect(() => {
        if (rates) {
            convert();
        }
    }, [amount, fromCurrency, toCurrency, rates]);

    const convert = () => {
        if (!rates || !amount) return;

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const converted = (amount / fromRate) * toRate;

        setResult({
            value: converted,
            rate: toRate / fromRate
        });
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
        }
        return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
    };

    const popularPairs = [
        { from: 'USD', to: 'INR' },
        { from: 'USD', to: 'EUR' },
        { from: 'EUR', to: 'GBP' },
        { from: 'USD', to: 'JPY' },
        { from: 'GBP', to: 'USD' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Amount
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                        className="input-field text-xl font-bold"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        From
                    </label>
                    <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="input-field"
                    >
                        {currencies.map(c => (
                            <option key={c} value={c}>{c} - {currencyNames[c]}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        To
                    </label>
                    <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="input-field"
                    >
                        {currencies.map(c => (
                            <option key={c} value={c}>{c} - {currencyNames[c]}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-center">
                <button onClick={swapCurrencies} className="btn-secondary">
                    <ArrowLeftRight size={18} />
                    Swap Currencies
                </button>
            </div>

            {result && (
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-center">
                    <p className="text-sm text-[var(--text-muted)] mb-2">
                        {formatNumber(amount)} {fromCurrency} =
                    </p>
                    <p className="text-4xl font-bold mb-2">
                        {formatNumber(result.value)} {toCurrency}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                        1 {fromCurrency} = {formatNumber(result.rate)} {toCurrency}
                    </p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Popular Pairs
                </label>
                <div className="flex flex-wrap gap-2">
                    {popularPairs.map((pair, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setFromCurrency(pair.from);
                                setToCurrency(pair.to);
                            }}
                            className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                            {pair.from} → {pair.to}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 text-sm">
                    ⚠️ Exchange rates are approximate and for reference only. For actual transactions, please check with your bank or financial institution.
                </p>
            </div>
        </div>
    );
};

export default CurrencyConverter;
