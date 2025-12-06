import { useState, useMemo } from 'react';
import { Copy, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const PasswordGenerator = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false
    });
    const [showPassword, setShowPassword] = useState(true);
    const [history, setHistory] = useState([]);
    const { toast } = useToast();

    const charsets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const similarChars = 'il1Lo0O';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

    const generatePassword = () => {
        let charset = '';

        if (options.uppercase) charset += charsets.uppercase;
        if (options.lowercase) charset += charsets.lowercase;
        if (options.numbers) charset += charsets.numbers;
        if (options.symbols) charset += charsets.symbols;

        if (!charset) {
            toast.warning('Please select at least one character type');
            return;
        }

        // Remove similar characters if option is enabled
        if (options.excludeSimilar) {
            charset = charset.split('').filter(c => !similarChars.includes(c)).join('');
        }

        // Remove ambiguous characters if option is enabled
        if (options.excludeAmbiguous) {
            charset = charset.split('').filter(c => !ambiguousChars.includes(c)).join('');
        }

        // Generate password using crypto API for better randomness
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length];
        }

        setPassword(newPassword);
        setHistory(prev => [newPassword, ...prev.slice(0, 9)]);
        toast.success('Password generated!');
    };

    const copyPassword = (pwd = password) => {
        navigator.clipboard.writeText(pwd);
        toast.success('Password copied to clipboard');
    };

    // Calculate password strength
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: 'None', color: 'gray' };

        let score = 0;

        // Length scoring
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;

        // Character diversity
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^a-zA-Z0-9]/.test(password)) score += 1;

        // Normalize to 0-4 scale
        const normalizedScore = Math.min(Math.floor(score / 2), 4);

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];

        return {
            score: normalizedScore,
            label: labels[normalizedScore],
            color: colors[normalizedScore]
        };
    }, [password]);

    return (
        <div className="space-y-6">
            {/* Generated Password Display */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1 overflow-hidden">
                        <p className="font-mono text-2xl break-all text-[var(--text-primary)]">
                            {showPassword ? (password || 'Click generate to create a password') : '•'.repeat(password.length || 20)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                        <button
                            onClick={() => copyPassword()}
                            disabled={!password}
                            className="p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] transition-colors disabled:opacity-50"
                        >
                            <Copy size={20} />
                        </button>
                    </div>
                </div>

                {/* Strength Meter */}
                {password && (
                    <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-[var(--text-muted)]">Strength</span>
                            <span style={{ color: strength.color }} className="font-medium">
                                {strength.label}
                            </span>
                        </div>
                        <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-300"
                                style={{
                                    width: `${(strength.score + 1) * 20}%`,
                                    backgroundColor: strength.color
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Length Slider */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                        Password Length
                    </label>
                    <span className="text-lg font-bold text-[var(--text-primary)]">{length}</span>
                </div>
                <input
                    type="range"
                    min="4"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value))}
                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                    <span>4</span>
                    <span>16</span>
                    <span>32</span>
                    <span>48</span>
                    <span>64</span>
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                    { key: 'uppercase', label: 'Uppercase (A-Z)' },
                    { key: 'lowercase', label: 'Lowercase (a-z)' },
                    { key: 'numbers', label: 'Numbers (0-9)' },
                    { key: 'symbols', label: 'Symbols (!@#$)' },
                    { key: 'excludeSimilar', label: 'Exclude Similar (il1Lo0O)' },
                    { key: 'excludeAmbiguous', label: 'Exclude Ambiguous ({}[])' }
                ].map((opt) => (
                    <label
                        key={opt.key}
                        className={`
              flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
              ${options[opt.key]
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-[var(--border-color)] hover:border-[var(--border-hover)]'}
            `}
                    >
                        <input
                            type="checkbox"
                            checked={options[opt.key]}
                            onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })}
                            className="w-4 h-4 rounded border-[var(--border-color)] text-blue-500"
                        />
                        <span className="text-sm">{opt.label}</span>
                    </label>
                ))}
            </div>

            {/* Generate Button */}
            <button onClick={generatePassword} className="btn-primary w-full py-4 text-lg">
                <RefreshCw size={22} />
                Generate Password
            </button>

            {/* History */}
            {history.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                        Recent Passwords
                    </h3>
                    <div className="space-y-2">
                        {history.map((pwd, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl"
                            >
                                <code className="font-mono text-sm text-[var(--text-muted)] truncate flex-1 mr-4">
                                    {pwd}
                                </code>
                                <button
                                    onClick={() => copyPassword(pwd)}
                                    className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <Shield size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-400">
                    Passwords are generated locally using the Web Crypto API. They are never transmitted or stored anywhere.
                </p>
            </div>
        </div>
    );
};

export default PasswordGenerator;
