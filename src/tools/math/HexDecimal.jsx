import { useState } from 'react';
import { Copy, ArrowUpDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const HexDecimal = () => {
    const [decimal, setDecimal] = useState('');
    const [hex, setHex] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const { toast } = useToast();

    const updateFromDecimal = (value) => {
        setDecimal(value);
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
            setHex(num.toString(16).toUpperCase());
            setBinary(num.toString(2));
            setOctal(num.toString(8));
        } else {
            setHex('');
            setBinary('');
            setOctal('');
        }
    };

    const updateFromHex = (value) => {
        setHex(value.toUpperCase());
        const num = parseInt(value, 16);
        if (!isNaN(num)) {
            setDecimal(num.toString());
            setBinary(num.toString(2));
            setOctal(num.toString(8));
        } else {
            setDecimal('');
            setBinary('');
            setOctal('');
        }
    };

    const updateFromBinary = (value) => {
        setBinary(value.replace(/[^01]/g, ''));
        const num = parseInt(value, 2);
        if (!isNaN(num)) {
            setDecimal(num.toString());
            setHex(num.toString(16).toUpperCase());
            setOctal(num.toString(8));
        } else {
            setDecimal('');
            setHex('');
            setOctal('');
        }
    };

    const updateFromOctal = (value) => {
        setOctal(value.replace(/[^0-7]/g, ''));
        const num = parseInt(value, 8);
        if (!isNaN(num)) {
            setDecimal(num.toString());
            setHex(num.toString(16).toUpperCase());
            setBinary(num.toString(2));
        } else {
            setDecimal('');
            setHex('');
            setBinary('');
        }
    };

    const copyValue = (value, label) => {
        navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    };

    const clearAll = () => {
        setDecimal('');
        setHex('');
        setBinary('');
        setOctal('');
    };

    const conversions = [
        { label: 'Decimal', value: decimal, onChange: updateFromDecimal, prefix: '', color: 'blue' },
        { label: 'Hexadecimal', value: hex, onChange: updateFromHex, prefix: '0x', color: 'purple' },
        { label: 'Binary', value: binary, onChange: updateFromBinary, prefix: '0b', color: 'green' },
        { label: 'Octal', value: octal, onChange: updateFromOctal, prefix: '0o', color: 'orange' }
    ];

    const examples = [
        { dec: '255', hex: 'FF', desc: 'Max 8-bit' },
        { dec: '65535', hex: 'FFFF', desc: 'Max 16-bit' },
        { dec: '16777215', hex: 'FFFFFF', desc: 'Max 24-bit (white color)' },
        { dec: '256', hex: '100', desc: '2^8' },
        { dec: '1024', hex: '400', desc: '1 KB' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {conversions.map((conv) => (
                    <div key={conv.label} className="relative">
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            {conv.label}
                        </label>
                        <div className="relative">
                            {conv.prefix && (
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono">
                                    {conv.prefix}
                                </span>
                            )}
                            <input
                                type="text"
                                value={conv.value}
                                onChange={(e) => conv.onChange(e.target.value)}
                                placeholder={`Enter ${conv.label.toLowerCase()}`}
                                className={`input-field font-mono ${conv.prefix ? 'pl-10' : ''} pr-10`}
                            />
                            <button
                                onClick={() => copyValue(conv.value, conv.label)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[var(--bg-tertiary)] rounded"
                                disabled={!conv.value}
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center">
                <button onClick={clearAll} className="btn-secondary">
                    Clear All
                </button>
            </div>

            {decimal && (
                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <h4 className="font-medium mb-3">Quick Info</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-[var(--text-muted)]">Bits needed</p>
                            <p className="font-mono">{binary.length}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)]">Bytes needed</p>
                            <p className="font-mono">{Math.ceil(binary.length / 8)}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)]">Is Power of 2</p>
                            <p className="font-mono">{parseInt(decimal) > 0 && (parseInt(decimal) & (parseInt(decimal) - 1)) === 0 ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                            <p className="text-[var(--text-muted)]">Is Even</p>
                            <p className="font-mono">{parseInt(decimal) % 2 === 0 ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h4 className="font-medium mb-3">Common Examples</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {examples.map((ex, i) => (
                        <button
                            key={i}
                            onClick={() => updateFromDecimal(ex.dec)}
                            className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] rounded-lg text-left transition-colors"
                        >
                            <div>
                                <p className="font-mono text-sm">
                                    <span className="text-blue-400">{ex.dec}</span>
                                    <span className="text-[var(--text-muted)]"> = </span>
                                    <span className="text-purple-400">0x{ex.hex}</span>
                                </p>
                                <p className="text-xs text-[var(--text-muted)]">{ex.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HexDecimal;
