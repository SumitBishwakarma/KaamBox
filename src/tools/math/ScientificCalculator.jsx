import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Copy, Check, RotateCcw } from 'lucide-react';

const ScientificCalculator = () => {
    const [display, setDisplay] = useState('0');
    const [memory, setMemory] = useState(0);
    const [lastResult, setLastResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [isRadian, setIsRadian] = useState(true);

    const handleNumber = (num) => {
        if (display === '0' || display === 'Error') {
            setDisplay(num);
        } else {
            setDisplay(display + num);
        }
    };

    const handleOperator = (op) => {
        setDisplay(display + op);
    };

    const handleFunction = (func) => {
        try {
            let value = parseFloat(display);
            if (isNaN(value)) return;

            if (!isRadian && ['sin', 'cos', 'tan'].includes(func)) {
                value = value * (Math.PI / 180);
            }

            let result;
            switch (func) {
                case 'sin': result = Math.sin(value); break;
                case 'cos': result = Math.cos(value); break;
                case 'tan': result = Math.tan(value); break;
                case 'log': result = Math.log10(value); break;
                case 'ln': result = Math.log(value); break;
                case 'sqrt': result = Math.sqrt(value); break;
                case 'pow2': result = Math.pow(value, 2); break;
                case 'pow3': result = Math.pow(value, 3); break;
                case 'inv': result = 1 / value; break;
                case 'abs': result = Math.abs(value); break;
                case 'fact': result = factorial(Math.floor(value)); break;
                case 'exp': result = Math.exp(value); break;
                default: return;
            }

            setDisplay(result.toString());
            setLastResult(result);
        } catch {
            setDisplay('Error');
        }
    };

    const factorial = (n) => {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    };

    const calculate = () => {
        try {
            // Replace symbols for eval
            let expression = display
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/π/g, Math.PI.toString())
                .replace(/e(?![x])/g, Math.E.toString());

            // Use Function instead of eval for safety
            const result = new Function('return ' + expression)();
            setDisplay(result.toString());
            setLastResult(result);
        } catch {
            setDisplay('Error');
        }
    };

    const clear = () => setDisplay('0');
    const clearEntry = () => setDisplay(display.slice(0, -1) || '0');

    const memoryStore = () => setMemory(parseFloat(display) || 0);
    const memoryRecall = () => setDisplay(memory.toString());
    const memoryClear = () => setMemory(0);
    const memoryAdd = () => setMemory(memory + (parseFloat(display) || 0));

    const copyResult = () => {
        navigator.clipboard.writeText(display);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const buttons = [
        ['MC', 'MR', 'M+', 'MS'],
        ['sin', 'cos', 'tan', 'π'],
        ['log', 'ln', '(', ')'],
        ['x²', 'x³', '√', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['0', '.', '±', '=']
    ];

    const handleButtonClick = (btn) => {
        switch (btn) {
            case 'MC': memoryClear(); break;
            case 'MR': memoryRecall(); break;
            case 'M+': memoryAdd(); break;
            case 'MS': memoryStore(); break;
            case 'sin': handleFunction('sin'); break;
            case 'cos': handleFunction('cos'); break;
            case 'tan': handleFunction('tan'); break;
            case 'π': handleOperator(Math.PI.toFixed(8)); break;
            case 'log': handleFunction('log'); break;
            case 'ln': handleFunction('ln'); break;
            case '(': handleOperator('('); break;
            case ')': handleOperator(')'); break;
            case 'x²': handleFunction('pow2'); break;
            case 'x³': handleFunction('pow3'); break;
            case '√': handleFunction('sqrt'); break;
            case '÷': handleOperator('÷'); break;
            case '×': handleOperator('×'); break;
            case '-': handleOperator('-'); break;
            case '+': handleOperator('+'); break;
            case '=': calculate(); break;
            case '±': setDisplay((parseFloat(display) * -1).toString()); break;
            case '.':
                if (!display.includes('.')) handleOperator('.');
                break;
            default:
                if (/[0-9]/.test(btn)) handleNumber(btn);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Scientific Calculator</h2>
                <p className="text-[var(--text-muted)] text-sm">Advanced calculations at your fingertips</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                    <button
                        onClick={() => setIsRadian(true)}
                        className={`px-3 py-1 rounded-lg text-xs ${isRadian ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                        RAD
                    </button>
                    <button
                        onClick={() => setIsRadian(false)}
                        className={`px-3 py-1 rounded-lg text-xs ${!isRadian ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'}`}
                    >
                        DEG
                    </button>
                </div>

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[var(--text-muted)]">M: {memory}</span>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={copyResult}
                                className="p-1"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={clearEntry}
                                className="p-1"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                    <p className="text-3xl font-mono text-right truncate">{display}</p>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clear}
                        className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-500 font-bold"
                    >
                        C
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={clearEntry}
                        className="flex-1 py-3 rounded-xl bg-orange-500/20 text-orange-500 font-bold"
                    >
                        CE
                    </motion.button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {buttons.flat().map((btn) => (
                        <motion.button
                            key={btn}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleButtonClick(btn)}
                            className={`p-3 rounded-xl font-medium text-lg transition-colors ${btn === '='
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : /[0-9.]/.test(btn)
                                        ? 'bg-[var(--bg-tertiary)]'
                                        : 'bg-[var(--bg-secondary)]'
                                }`}
                        >
                            {btn}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScientificCalculator;
