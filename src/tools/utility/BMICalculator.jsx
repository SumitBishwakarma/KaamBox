import { useState, useMemo } from 'react';
import { Scale, ArrowLeftRight } from 'lucide-react';

const BMICalculator = () => {
    const [unit, setUnit] = useState('metric'); // metric or imperial
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [heightFt, setHeightFt] = useState('');
    const [heightIn, setHeightIn] = useState('');

    const result = useMemo(() => {
        let bmi;

        if (unit === 'metric') {
            const w = parseFloat(weight);
            const h = parseFloat(height) / 100; // cm to m
            if (!w || !h || h === 0) return null;
            bmi = w / (h * h);
        } else {
            const w = parseFloat(weight);
            const ft = parseFloat(heightFt) || 0;
            const inches = parseFloat(heightIn) || 0;
            const totalInches = ft * 12 + inches;
            if (!w || totalInches === 0) return null;
            bmi = (w * 703) / (totalInches * totalInches);
        }

        let category, color, advice;

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6';
            advice = 'You may need to gain weight. Consult a healthcare provider.';
        } else if (bmi < 25) {
            category = 'Normal weight';
            color = '#22c55e';
            advice = 'Great! Maintain a healthy lifestyle with balanced diet and regular exercise.';
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b';
            advice = 'Consider lifestyle changes like improved diet and increased physical activity.';
        } else {
            category = 'Obese';
            color = '#ef4444';
            advice = 'Consider consulting a healthcare provider for personalized advice.';
        }

        // Calculate healthy weight range
        let healthyWeightMin, healthyWeightMax;
        if (unit === 'metric') {
            const h = parseFloat(height) / 100;
            healthyWeightMin = (18.5 * h * h).toFixed(1);
            healthyWeightMax = (24.9 * h * h).toFixed(1);
        } else {
            const totalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
            healthyWeightMin = ((18.5 * totalInches * totalInches) / 703).toFixed(1);
            healthyWeightMax = ((24.9 * totalInches * totalInches) / 703).toFixed(1);
        }

        return {
            bmi: bmi.toFixed(1),
            category,
            color,
            advice,
            healthyWeightMin,
            healthyWeightMax
        };
    }, [weight, height, heightFt, heightIn, unit]);

    // BMI Scale position (0% to 100%)
    const scalePosition = useMemo(() => {
        if (!result) return 0;
        const bmi = parseFloat(result.bmi);
        // Scale goes from 15 to 40
        const pos = ((bmi - 15) / (40 - 15)) * 100;
        return Math.max(0, Math.min(100, pos));
    }, [result]);

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Unit Toggle */}
            <div className="flex bg-[var(--bg-tertiary)] rounded-xl p-1 max-w-xs mx-auto">
                <button
                    onClick={() => setUnit('metric')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${unit === 'metric'
                        ? 'bg-blue-500 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Metric (kg/cm)
                </button>
                <button
                    onClick={() => setUnit('imperial')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${unit === 'imperial'
                        ? 'bg-blue-500 text-white'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    Imperial (lb/ft)
                </button>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                        className="input-field"
                    />
                </div>

                {/* Height */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Height ({unit === 'metric' ? 'cm' : 'ft / in'})
                    </label>
                    {unit === 'metric' ? (
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g., 175"
                            className="input-field"
                        />
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={heightFt}
                                onChange={(e) => setHeightFt(e.target.value)}
                                placeholder="ft"
                                className="input-field flex-1"
                            />
                            <input
                                type="number"
                                value={heightIn}
                                onChange={(e) => setHeightIn(e.target.value)}
                                placeholder="in"
                                className="input-field flex-1"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Result */}
            {result && (
                <>
                    {/* BMI Value */}
                    <div className="text-center py-8 bg-[var(--bg-tertiary)] rounded-2xl">
                        <p className="text-sm text-[var(--text-muted)] mb-2">Your BMI</p>
                        <p className="text-6xl font-bold" style={{ color: result.color }}>
                            {result.bmi}
                        </p>
                        <p className="text-xl font-medium mt-2" style={{ color: result.color }}>
                            {result.category}
                        </p>
                    </div>

                    {/* BMI Scale */}
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                        <div className="relative h-8 mb-6">
                            {/* Scale Background */}
                            <div className="absolute inset-0 flex rounded-full overflow-hidden">
                                <div className="flex-1 bg-blue-500" />
                                <div className="flex-1 bg-green-500" />
                                <div className="flex-1 bg-yellow-500" />
                                <div className="flex-1 bg-red-500" />
                            </div>

                            {/* Indicator */}
                            <div
                                className="absolute top-0 w-1 h-full bg-[var(--bg-primary)] shadow-lg transition-all duration-500 border-x border-[var(--border-primary)]"
                                style={{ left: `${scalePosition}%`, transform: 'translateX(-50%)' }}
                            />

                            {/* Labels */}
                            <div className="absolute -bottom-5 left-0 text-xs text-[var(--text-muted)]">15</div>
                            <div className="absolute -bottom-5 left-1/4 text-xs text-[var(--text-muted)]">18.5</div>
                            <div className="absolute -bottom-5 left-1/2 text-xs text-[var(--text-muted)] -translate-x-1/2">25</div>
                            <div className="absolute -bottom-5 left-3/4 text-xs text-[var(--text-muted)]">30</div>
                            <div className="absolute -bottom-5 right-0 text-xs text-[var(--text-muted)]">40</div>
                        </div>

                        <div className="flex justify-between text-xs text-[var(--text-muted)] mt-4">
                            <span>Underweight</span>
                            <span>Normal</span>
                            <span>Overweight</span>
                            <span>Obese</span>
                        </div>
                    </div>

                    {/* Advice */}
                    <div className="p-4 rounded-xl" style={{ backgroundColor: `${result.color}15`, borderColor: `${result.color}30`, borderWidth: 1 }}>
                        <p className="text-sm" style={{ color: result.color }}>
                            {result.advice}
                        </p>
                    </div>

                    {/* Healthy Weight Range */}
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Scale size={18} className="text-green-500" />
                            <span className="font-medium">Healthy Weight Range</span>
                        </div>
                        <p className="text-lg">
                            <span className="text-green-500 font-bold">{result.healthyWeightMin}</span>
                            <span className="text-[var(--text-muted)]"> — </span>
                            <span className="text-green-500 font-bold">{result.healthyWeightMax}</span>
                            <span className="text-[var(--text-muted)] ml-2">
                                {unit === 'metric' ? 'kg' : 'lbs'}
                            </span>
                        </p>
                    </div>
                </>
            )}

            {/* Disclaimer */}
            <p className="text-center text-xs text-[var(--text-muted)]">
                BMI is a general indicator and may not be accurate for athletes, elderly, or pregnant women.
                Consult a healthcare professional for personalized advice.
            </p>
        </div>
    );
};

export default BMICalculator;
