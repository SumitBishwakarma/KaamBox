import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, RefreshCw } from 'lucide-react';

const FancyText = () => {
    const [inputText, setInputText] = useState('');
    const [copied, setCopied] = useState(null);

    const styles = {
        bold: {
            name: 'Bold', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D400);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D41A);
                return c;
            }).join('')
        },
        italic: {
            name: 'Italic', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D434);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D44E);
                return c;
            }).join('')
        },
        script: {
            name: 'Script', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D49C);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D4B6);
                return c;
            }).join('')
        },
        fraktur: {
            name: 'Gothic', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D504);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D51E);
                return c;
            }).join('')
        },
        double: {
            name: 'Double Struck', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D538);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D552);
                return c;
            }).join('')
        },
        mono: {
            name: 'Monospace', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1D670);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1D68A);
                return c;
            }).join('')
        },
        circled: {
            name: 'Circled', transform: (t) => t.split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x24B6);
                if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x24D0);
                return c;
            }).join('')
        },
        squared: {
            name: 'Squared', transform: (t) => t.toUpperCase().split('').map(c => {
                const code = c.charCodeAt(0);
                if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1F130);
                return c;
            }).join('')
        },
        upsideDown: {
            name: 'Upside Down', transform: (t) => {
                const map = { 'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z' };
                return t.toLowerCase().split('').reverse().map(c => map[c] || c).join('');
            }
        },
        strikethrough: { name: 'Strikethrough', transform: (t) => t.split('').join('\u0336') + '\u0336' },
        underline: { name: 'Underline', transform: (t) => t.split('').join('\u0332') + '\u0332' },
        sparkles: { name: 'Sparkles', transform: (t) => `✨ ${t} ✨` },
        stars: { name: 'Stars', transform: (t) => `★彡 ${t} 彡★` },
        flowers: { name: 'Flowers', transform: (t) => `✿ ${t} ✿` },
        hearts: { name: 'Hearts', transform: (t) => `♥ ${t} ♥` }
    };

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Fancy Text Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Convert your text to stylish fonts for social media</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Your Text</label>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type something cool..."
                        className="input w-full text-lg"
                    />
                </div>

                {inputText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <p className="text-sm text-[var(--text-muted)]">Click to copy any style:</p>

                        <div className="grid gap-2">
                            {Object.entries(styles).map(([key, style]) => {
                                const transformed = style.transform(inputText);
                                return (
                                    <motion.div
                                        key={key}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => copyToClipboard(transformed, key)}
                                        className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-[var(--text-muted)] w-24">{style.name}</span>
                                            <span className="text-lg break-all">{transformed}</span>
                                        </div>
                                        {copied === key ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {!inputText && (
                    <div className="text-center py-12 text-[var(--text-muted)]">
                        <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Enter some text above to see fancy styles</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FancyText;
