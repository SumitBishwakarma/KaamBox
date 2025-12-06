import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';

const UnitConverter = () => {
    const [category, setCategory] = useState('length');
    const [fromUnit, setFromUnit] = useState('m');
    const [toUnit, setToUnit] = useState('ft');
    const [fromValue, setFromValue] = useState('1');

    const units = {
        length: {
            name: 'Length',
            units: {
                mm: { name: 'Millimeter', toBase: 0.001 },
                cm: { name: 'Centimeter', toBase: 0.01 },
                m: { name: 'Meter', toBase: 1 },
                km: { name: 'Kilometer', toBase: 1000 },
                in: { name: 'Inch', toBase: 0.0254 },
                ft: { name: 'Foot', toBase: 0.3048 },
                yd: { name: 'Yard', toBase: 0.9144 },
                mi: { name: 'Mile', toBase: 1609.344 }
            }
        },
        weight: {
            name: 'Weight',
            units: {
                mg: { name: 'Milligram', toBase: 0.000001 },
                g: { name: 'Gram', toBase: 0.001 },
                kg: { name: 'Kilogram', toBase: 1 },
                t: { name: 'Tonne', toBase: 1000 },
                oz: { name: 'Ounce', toBase: 0.0283495 },
                lb: { name: 'Pound', toBase: 0.453592 },
                st: { name: 'Stone', toBase: 6.35029 }
            }
        },
        temperature: {
            name: 'Temperature',
            units: {
                c: { name: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
                f: { name: 'Fahrenheit', toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
                k: { name: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 }
            }
        },
        area: {
            name: 'Area',
            units: {
                'mm²': { name: 'Sq Millimeter', toBase: 0.000001 },
                'cm²': { name: 'Sq Centimeter', toBase: 0.0001 },
                'm²': { name: 'Sq Meter', toBase: 1 },
                'km²': { name: 'Sq Kilometer', toBase: 1000000 },
                'ha': { name: 'Hectare', toBase: 10000 },
                'in²': { name: 'Sq Inch', toBase: 0.00064516 },
                'ft²': { name: 'Sq Foot', toBase: 0.092903 },
                'ac': { name: 'Acre', toBase: 4046.86 }
            }
        },
        volume: {
            name: 'Volume',
            units: {
                ml: { name: 'Milliliter', toBase: 0.001 },
                l: { name: 'Liter', toBase: 1 },
                'm³': { name: 'Cubic Meter', toBase: 1000 },
                gal: { name: 'Gallon (US)', toBase: 3.78541 },
                qt: { name: 'Quart', toBase: 0.946353 },
                pt: { name: 'Pint', toBase: 0.473176 },
                cup: { name: 'Cup', toBase: 0.236588 },
                'fl oz': { name: 'Fluid Ounce', toBase: 0.0295735 }
            }
        },
        speed: {
            name: 'Speed',
            units: {
                'km/h': { name: 'km/hour', toBase: 1 },
                'm/s': { name: 'm/second', toBase: 3.6 },
                'mph': { name: 'miles/hour', toBase: 1.60934 },
                'knot': { name: 'Knot', toBase: 1.852 },
                'ft/s': { name: 'feet/second', toBase: 1.09728 }
            }
        },
        data: {
            name: 'Data',
            units: {
                b: { name: 'Byte', toBase: 1 },
                kb: { name: 'Kilobyte', toBase: 1024 },
                mb: { name: 'Megabyte', toBase: 1048576 },
                gb: { name: 'Gigabyte', toBase: 1073741824 },
                tb: { name: 'Terabyte', toBase: 1099511627776 },
                bit: { name: 'Bit', toBase: 0.125 }
            }
        }
    };

    // Update units when category changes
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        const unitKeys = Object.keys(units[newCategory].units);
        setFromUnit(unitKeys[0]);
        setToUnit(unitKeys[1] || unitKeys[0]);
        setFromValue('1');
    };

    const swapUnits = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const convert = useMemo(() => {
        const value = parseFloat(fromValue);
        if (isNaN(value)) return '';

        const categoryData = units[category];
        const from = categoryData.units[fromUnit];
        const to = categoryData.units[toUnit];

        // Temperature has special conversion
        if (category === 'temperature') {
            const baseValue = from.toBase(value);
            const result = to.fromBase(baseValue);
            return result.toFixed(4).replace(/\.?0+$/, '');
        }

        // Standard conversion: value * (from toBase) / (to toBase)
        const baseValue = value * from.toBase;
        const result = baseValue / to.toBase;

        // Format result
        if (Math.abs(result) < 0.0001 || Math.abs(result) >= 100000000) {
            return result.toExponential(4);
        }
        return result.toFixed(6).replace(/\.?0+$/, '');
    }, [fromValue, fromUnit, toUnit, category]);

    const currentUnits = units[category].units;

    return (
        <div className="space-y-6">
            {/* Category Selection */}
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Category
                </label>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(units).map(([key, { name }]) => (
                        <button
                            key={key}
                            onClick={() => handleCategoryChange(key)}
                            className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${category === key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}
              `}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Converter */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
                {/* From */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        From
                    </label>
                    <div className="space-y-2">
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value)}
                            className="input-field"
                        >
                            {Object.entries(currentUnits).map(([key, { name }]) => (
                                <option key={key} value={key}>{name} ({key})</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={fromValue}
                            onChange={(e) => setFromValue(e.target.value)}
                            className="input-field text-2xl text-center"
                            placeholder="Enter value"
                        />
                    </div>
                </div>

                {/* Swap Button */}
                <button
                    onClick={swapUnits}
                    className="p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors self-center mb-2"
                >
                    <ArrowLeftRight size={24} />
                </button>

                {/* To */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        To
                    </label>
                    <div className="space-y-2">
                        <select
                            value={toUnit}
                            onChange={(e) => setToUnit(e.target.value)}
                            className="input-field"
                        >
                            {Object.entries(currentUnits).map(([key, { name }]) => (
                                <option key={key} value={key}>{name} ({key})</option>
                            ))}
                        </select>
                        <div className="input-field text-2xl text-center bg-blue-500/10 border-blue-500/30">
                            {convert || '0'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Formula Display */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 text-center">
                <p className="text-lg">
                    <span className="text-[var(--text-muted)]">{fromValue || '0'}</span>
                    <span className="text-[var(--text-muted)] mx-2">{currentUnits[fromUnit].name}</span>
                    <span className="text-blue-500 mx-2">=</span>
                    <span className="text-[var(--text-primary)] font-bold">{convert || '0'}</span>
                    <span className="text-[var(--text-muted)] ml-2">{currentUnits[toUnit].name}</span>
                </p>
            </div>

            {/* Quick Reference */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <h4 className="font-medium text-blue-400 mb-2">Quick Reference</h4>
                <p className="text-sm text-blue-300">
                    {category === 'length' && '1 inch = 2.54 cm | 1 foot = 30.48 cm | 1 mile = 1.609 km'}
                    {category === 'weight' && '1 pound = 0.454 kg | 1 ounce = 28.35 g | 1 stone = 6.35 kg'}
                    {category === 'temperature' && '°F = °C × (9/5) + 32 | K = °C + 273.15'}
                    {category === 'area' && '1 acre = 4,047 m² | 1 hectare = 10,000 m²'}
                    {category === 'volume' && '1 gallon = 3.785 L | 1 cup = 236.6 mL'}
                    {category === 'speed' && '1 mph = 1.609 km/h | 1 knot = 1.852 km/h'}
                    {category === 'data' && '1 KB = 1,024 B | 1 MB = 1,024 KB | 1 GB = 1,024 MB'}
                </p>
            </div>
        </div>
    );
};

export default UnitConverter;
