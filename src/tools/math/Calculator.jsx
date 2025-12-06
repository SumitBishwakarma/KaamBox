import { useState } from 'react';
import { Delete, Equal } from 'lucide-react';

const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState(null);
    const [operator, setOperator] = useState(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [history, setHistory] = useState([]);

    const inputDigit = (digit) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }

        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const toggleSign = () => {
        setDisplay(String(-parseFloat(display)));
    };

    const inputPercent = () => {
        const value = parseFloat(display) / 100;
        setDisplay(String(value));
    };

    const performOperation = (nextOperator) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const currentValue = previousValue || 0;
            let result;

            switch (operator) {
                case '+':
                    result = currentValue + inputValue;
                    break;
                case '-':
                    result = currentValue - inputValue;
                    break;
                case '*':
                    result = currentValue * inputValue;
                    break;
                case '/':
                    result = inputValue !== 0 ? currentValue / inputValue : 'Error';
                    break;
                default:
                    result = inputValue;
            }

            if (nextOperator === '=') {
                setHistory(prev => [{
                    expression: `${currentValue} ${operator} ${inputValue}`,
                    result: result
                }, ...prev.slice(0, 9)]);
            }

            setDisplay(String(result));
            setPreviousValue(result);
        }

        setWaitingForOperand(true);
        setOperator(nextOperator === '=' ? null : nextOperator);
        if (nextOperator === '=') {
            setPreviousValue(null);
        }
    };

    const handleBackspace = () => {
        if (display.length > 1 && display !== '0') {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    const buttons = [
        { label: 'C', action: clear, className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
        { label: '±', action: toggleSign, className: 'bg-[var(--bg-secondary)]' },
        { label: '%', action: inputPercent, className: 'bg-[var(--bg-secondary)]' },
        { label: '÷', action: () => performOperation('/'), className: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' },

        { label: '7', action: () => inputDigit('7') },
        { label: '8', action: () => inputDigit('8') },
        { label: '9', action: () => inputDigit('9') },
        { label: '×', action: () => performOperation('*'), className: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' },

        { label: '4', action: () => inputDigit('4') },
        { label: '5', action: () => inputDigit('5') },
        { label: '6', action: () => inputDigit('6') },
        { label: '-', action: () => performOperation('-'), className: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' },

        { label: '1', action: () => inputDigit('1') },
        { label: '2', action: () => inputDigit('2') },
        { label: '3', action: () => inputDigit('3') },
        { label: '+', action: () => performOperation('+'), className: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' },

        { label: '0', action: () => inputDigit('0'), className: 'col-span-2' },
        { label: '.', action: inputDecimal },
        { label: '=', action: () => performOperation('='), className: 'bg-blue-500 text-white hover:bg-blue-600' },
    ];

    // Handle keyboard input
    const handleKeyDown = (e) => {
        if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
        else if (e.key === '.') inputDecimal();
        else if (e.key === '+') performOperation('+');
        else if (e.key === '-') performOperation('-');
        else if (e.key === '*') performOperation('*');
        else if (e.key === '/') performOperation('/');
        else if (e.key === 'Enter' || e.key === '=') performOperation('=');
        else if (e.key === 'Escape') clear();
        else if (e.key === 'Backspace') handleBackspace();
        else if (e.key === '%') inputPercent();
    };

    return (
        <div
            className="max-w-sm mx-auto"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {/* Display */}
            <div className="bg-[var(--bg-tertiary)] rounded-2xl p-6 mb-4">
                <div className="text-right">
                    {previousValue !== null && operator && (
                        <p className="text-sm text-[var(--text-muted)] mb-2">
                            {previousValue} {operator === '*' ? '×' : operator === '/' ? '÷' : operator}
                        </p>
                    )}
                    <p className="text-4xl font-light text-[var(--text-primary)] truncate">
                        {display}
                    </p>
                </div>
            </div>

            {/* Button Grid */}
            <div className="grid grid-cols-4 gap-2">
                {buttons.map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.action}
                        className={`
              py-4 rounded-xl text-xl font-medium transition-all
              hover:scale-105 active:scale-95
              ${btn.className || 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)]'}
            `}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Backspace */}
            <button
                onClick={handleBackspace}
                className="w-full mt-2 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center gap-2 text-[var(--text-muted)]"
            >
                <Delete size={20} />
                Backspace
            </button>

            {/* History */}
            {history.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">History</h3>
                    <div className="space-y-2 max-h-48 overflow-auto">
                        {history.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-2 bg-[var(--bg-tertiary)] rounded-lg text-sm"
                            >
                                <span className="text-[var(--text-muted)]">{item.expression}</span>
                                <span className="font-medium text-[var(--text-primary)]">= {item.result}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tip */}
            <p className="text-xs text-center text-[var(--text-muted)] mt-4">
                Tip: Use keyboard for input
            </p>
        </div>
    );
};

export default Calculator;
