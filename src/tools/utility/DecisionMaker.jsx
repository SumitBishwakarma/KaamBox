import { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Plus, Trash2, Dices, Coins } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DecisionMaker = () => {
    const [mode, setMode] = useState('wheel');
    const [options, setOptions] = useState(['Option 1', 'Option 2', 'Option 3']);
    const [newOption, setNewOption] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [coinResult, setCoinResult] = useState(null);
    const [coinFlipping, setCoinFlipping] = useState(false);
    const { toast } = useToast();

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

    const addOption = () => {
        if (newOption.trim() && options.length < 8) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const spinWheel = () => {
        if (spinning || options.length < 2) return;

        setSpinning(true);
        setResult(null);

        const randomIndex = Math.floor(Math.random() * options.length);
        const segmentAngle = 360 / options.length;
        const targetRotation = 360 * 5 + (360 - (randomIndex * segmentAngle + segmentAngle / 2));

        setRotation(prev => prev + targetRotation);

        setTimeout(() => {
            setSpinning(false);
            setResult(options[randomIndex]);
            toast.success(`Result: ${options[randomIndex]}`);
        }, 4000);
    };

    const flipCoin = () => {
        if (coinFlipping) return;

        setCoinFlipping(true);
        setCoinResult(null);

        setTimeout(() => {
            const result = Math.random() > 0.5 ? 'Heads' : 'Tails';
            setCoinResult(result);
            setCoinFlipping(false);
            toast.success(`Result: ${result}`);
        }, 2000);
    };

    const rollDice = () => {
        const result = Math.floor(Math.random() * 6) + 1;
        setResult(result.toString());
        toast.success(`Rolled: ${result}`);
    };

    const randomPick = () => {
        const randomIndex = Math.floor(Math.random() * options.length);
        setResult(options[randomIndex]);
        toast.success(`Picked: ${options[randomIndex]}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {['wheel', 'coin', 'dice', 'random'].map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-2 rounded-lg capitalize ${mode === m ? 'bg-blue-500' : 'bg-[var(--bg-tertiary)] hover:bg-blue-500/20'
                            }`}
                    >
                        {m === 'wheel' ? '🎡 Spin Wheel' :
                            m === 'coin' ? '🪙 Flip Coin' :
                                m === 'dice' ? '🎲 Roll Dice' : '🎯 Random Pick'}
                    </button>
                ))}
            </div>

            {(mode === 'wheel' || mode === 'random') && (
                <div>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                            placeholder="Add an option..."
                            className="input-field flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && addOption()}
                        />
                        <button onClick={addOption} className="btn-primary" disabled={options.length >= 8}>
                            <Plus size={18} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {options.map((opt, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                style={{ backgroundColor: colors[i % colors.length] + '40' }}
                            >
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span>{opt}</span>
                                {options.length > 2 && (
                                    <button onClick={() => removeOption(i)} className="hover:text-red-400">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center p-8 bg-[var(--bg-tertiary)] rounded-xl">
                {mode === 'wheel' && (
                    <div className="relative">
                        <svg
                            viewBox="0 0 200 200"
                            className="w-64 h-64 transition-transform duration-[4000ms] ease-out"
                            style={{ transform: `rotate(${rotation}deg)` }}
                        >
                            {options.map((opt, i) => {
                                const angle = 360 / options.length;
                                const startAngle = i * angle - 90;
                                const endAngle = startAngle + angle;
                                const startRad = (startAngle * Math.PI) / 180;
                                const endRad = (endAngle * Math.PI) / 180;
                                const x1 = 100 + 90 * Math.cos(startRad);
                                const y1 = 100 + 90 * Math.sin(startRad);
                                const x2 = 100 + 90 * Math.cos(endRad);
                                const y2 = 100 + 90 * Math.sin(endRad);
                                const largeArc = angle > 180 ? 1 : 0;

                                return (
                                    <g key={i}>
                                        <path
                                            d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                            fill={colors[i % colors.length]}
                                            stroke="white"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={100 + 55 * Math.cos((startRad + endRad) / 2)}
                                            y={100 + 55 * Math.sin((startRad + endRad) / 2)}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="bold"
                                            transform={`rotate(${startAngle + angle / 2 + 90}, ${100 + 55 * Math.cos((startRad + endRad) / 2)}, ${100 + 55 * Math.sin((startRad + endRad) / 2)})`}
                                        >
                                            {opt.length > 10 ? opt.substring(0, 10) + '...' : opt}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-white" />
                        </div>
                    </div>
                )}

                {mode === 'coin' && (
                    <div
                        className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${coinFlipping ? 'animate-spin' : ''
                            }`}
                        style={{
                            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 50%, #ffd700 100%)',
                            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
                        }}
                    >
                        {coinResult || '?'}
                    </div>
                )}

                {mode === 'dice' && (
                    <div
                        className="w-24 h-24 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl flex items-center justify-center text-5xl shadow-lg"
                    >
                        {result ? ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][parseInt(result) - 1] : '🎲'}
                    </div>
                )}

                {mode === 'random' && (
                    <div className="text-center">
                        <Dices size={64} className="mx-auto text-blue-400 mb-4" />
                        <p className="text-[var(--text-muted)]">Click button to pick randomly</p>
                    </div>
                )}
            </div>

            {result && mode !== 'coin' && (
                <div className="p-4 bg-green-500/20 border border-green-500 rounded-xl text-center">
                    <p className="text-sm text-green-400 mb-1">Result</p>
                    <p className="text-2xl font-bold">{result}</p>
                </div>
            )}

            <div className="flex justify-center gap-3">
                {mode === 'wheel' && (
                    <button onClick={spinWheel} disabled={spinning || options.length < 2} className="btn-primary">
                        <Play size={18} />
                        {spinning ? 'Spinning...' : 'Spin Wheel'}
                    </button>
                )}
                {mode === 'coin' && (
                    <button onClick={flipCoin} disabled={coinFlipping} className="btn-primary">
                        <Coins size={18} />
                        {coinFlipping ? 'Flipping...' : 'Flip Coin'}
                    </button>
                )}
                {mode === 'dice' && (
                    <button onClick={rollDice} className="btn-primary">
                        <Dices size={18} />
                        Roll Dice
                    </button>
                )}
                {mode === 'random' && (
                    <button onClick={randomPick} disabled={options.length < 2} className="btn-primary">
                        <Dices size={18} />
                        Pick Random
                    </button>
                )}
                <button onClick={() => {
                    setResult(null);
                    setCoinResult(null);
                    setRotation(0);
                }} className="btn-secondary">
                    <RotateCcw size={18} />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default DecisionMaker;
