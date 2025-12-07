import { useState } from 'react';
import { motion } from 'framer-motion';
import { Fuel, DollarSign, Car, TrendingUp } from 'lucide-react';

const FuelCostCalculator = () => {
    const [distance, setDistance] = useState('');
    const [fuelEfficiency, setFuelEfficiency] = useState('');
    const [fuelPrice, setFuelPrice] = useState('');
    const [unit, setUnit] = useState('mpg');

    const calculate = () => {
        const dist = parseFloat(distance) || 0;
        const eff = parseFloat(fuelEfficiency) || 0;
        const price = parseFloat(fuelPrice) || 0;

        if (dist === 0 || eff === 0 || price === 0) return null;

        let fuelNeeded;
        if (unit === 'mpg') {
            fuelNeeded = dist / eff; // gallons
        } else {
            fuelNeeded = (dist * eff) / 100; // liters (L/100km)
        }

        const totalCost = fuelNeeded * price;
        const costPerMile = totalCost / dist;

        return {
            fuelNeeded: fuelNeeded.toFixed(2),
            totalCost: totalCost.toFixed(2),
            costPerMile: costPerMile.toFixed(3),
            unit: unit === 'mpg' ? 'gallons' : 'liters'
        };
    };

    const result = calculate();

    const commonDistances = [
        { name: '10 mi', value: 10 },
        { name: '50 mi', value: 50 },
        { name: '100 mi', value: 100 },
        { name: '500 mi', value: 500 }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Fuel Cost Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Calculate trip fuel costs</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setUnit('mpg')}
                        className={`flex-1 py-2 rounded-lg transition-colors ${unit === 'mpg' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        🇺🇸 MPG
                    </button>
                    <button
                        onClick={() => setUnit('lkm')}
                        className={`flex-1 py-2 rounded-lg transition-colors ${unit === 'lkm' ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        🌍 L/100km
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Distance ({unit === 'mpg' ? 'miles' : 'km'})
                    </label>
                    <input
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="0"
                        className="input w-full text-xl"
                    />
                    <div className="flex gap-2 mt-2">
                        {commonDistances.map(d => (
                            <button
                                key={d.name}
                                onClick={() => setDistance(d.value.toString())}
                                className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)]"
                            >
                                {d.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Fuel Efficiency ({unit === 'mpg' ? 'MPG' : 'L/100km'})
                    </label>
                    <input
                        type="number"
                        value={fuelEfficiency}
                        onChange={(e) => setFuelEfficiency(e.target.value)}
                        placeholder={unit === 'mpg' ? '25' : '8'}
                        className="input w-full text-xl"
                    />
                    <div className="flex gap-2 mt-2">
                        {unit === 'mpg'
                            ? [20, 25, 30, 35, 40].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setFuelEfficiency(v.toString())}
                                    className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)]"
                                >
                                    {v}
                                </button>
                            ))
                            : [6, 8, 10, 12, 15].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setFuelEfficiency(v.toString())}
                                    className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded hover:bg-[var(--bg-secondary)]"
                                >
                                    {v}
                                </button>
                            ))
                        }
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Fuel Price ($ per {unit === 'mpg' ? 'gallon' : 'liter'})
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            step="0.01"
                            value={fuelPrice}
                            onChange={(e) => setFuelPrice(e.target.value)}
                            placeholder={unit === 'mpg' ? '3.50' : '1.50'}
                            className="input w-full pl-10 text-xl"
                        />
                    </div>
                </div>

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl"
                    >
                        <div className="text-center mb-4">
                            <p className="text-sm text-[var(--text-muted)]">Total Trip Cost</p>
                            <p className="text-4xl font-bold text-green-400">${result.totalCost}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <Fuel className="w-6 h-6 mx-auto mb-1 text-blue-400" />
                                <p className="text-xl font-bold">{result.fuelNeeded}</p>
                                <p className="text-xs text-[var(--text-muted)]">{result.unit} needed</p>
                            </div>
                            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-400" />
                                <p className="text-xl font-bold">${result.costPerMile}</p>
                                <p className="text-xs text-[var(--text-muted)]">per {unit === 'mpg' ? 'mile' : 'km'}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FuelCostCalculator;
