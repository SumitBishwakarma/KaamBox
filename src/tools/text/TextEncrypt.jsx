import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Copy, Check, RefreshCw } from 'lucide-react';

const TextEncrypt = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [mode, setMode] = useState('encrypt');
    const [method, setMethod] = useState('base64');
    const [shift, setShift] = useState(3);
    const [copied, setCopied] = useState(false);

    const methods = {
        base64: {
            name: 'Base64',
            encrypt: (text) => btoa(unescape(encodeURIComponent(text))),
            decrypt: (text) => {
                try {
                    return decodeURIComponent(escape(atob(text)));
                } catch {
                    return 'Invalid Base64 input';
                }
            }
        },
        caesar: {
            name: 'Caesar Cipher',
            encrypt: (text, shift) => {
                return text.split('').map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= 65 && code <= 90) {
                        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
                    }
                    if (code >= 97 && code <= 122) {
                        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
                    }
                    return char;
                }).join('');
            },
            decrypt: (text, shift) => {
                return text.split('').map(char => {
                    const code = char.charCodeAt(0);
                    if (code >= 65 && code <= 90) {
                        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
                    }
                    if (code >= 97 && code <= 122) {
                        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
                    }
                    return char;
                }).join('');
            }
        },
        reverse: {
            name: 'Reverse',
            encrypt: (text) => text.split('').reverse().join(''),
            decrypt: (text) => text.split('').reverse().join('')
        },
        rot13: {
            name: 'ROT13',
            encrypt: (text) => {
                return text.replace(/[a-zA-Z]/g, (char) => {
                    const base = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
                });
            },
            decrypt: (text) => {
                return text.replace(/[a-zA-Z]/g, (char) => {
                    const base = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
                });
            }
        },
        binary: {
            name: 'Binary',
            encrypt: (text) => text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '),
            decrypt: (text) => {
                try {
                    return text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
                } catch {
                    return 'Invalid binary input';
                }
            }
        },
        hex: {
            name: 'Hexadecimal',
            encrypt: (text) => text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '),
            decrypt: (text) => {
                try {
                    return text.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
                } catch {
                    return 'Invalid hex input';
                }
            }
        }
    };

    const processText = () => {
        if (!inputText.trim()) {
            setOutputText('');
            return;
        }

        const selectedMethod = methods[method];
        if (mode === 'encrypt') {
            setOutputText(method === 'caesar' ? selectedMethod.encrypt(inputText, shift) : selectedMethod.encrypt(inputText));
        } else {
            setOutputText(method === 'caesar' ? selectedMethod.decrypt(inputText, shift) : selectedMethod.decrypt(inputText));
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapTexts = () => {
        setInputText(outputText);
        setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Text Encrypt / Decrypt</h2>
                <p className="text-[var(--text-muted)] text-sm">Encode and decode text with various methods</p>
            </div>

            <div className="space-y-4">
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => setMode('encrypt')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'encrypt' ? 'bg-green-500/20 text-green-400' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <Lock className="w-4 h-4" />
                        Encrypt
                    </button>
                    <button
                        onClick={() => setMode('decrypt')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${mode === 'decrypt' ? 'bg-blue-500/20 text-blue-400' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <Unlock className="w-4 h-4" />
                        Decrypt
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Encryption Method</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(methods).map(([key, m]) => (
                            <button
                                key={key}
                                onClick={() => setMethod(key)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${method === key ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {m.name}
                            </button>
                        ))}
                    </div>
                </div>

                {method === 'caesar' && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Shift Amount: {shift}</label>
                        <input
                            type="range"
                            min="1"
                            max="25"
                            value={shift}
                            onChange={(e) => setShift(parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-2">Input Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
                        className="input w-full h-28 resize-none"
                    />
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={processText}
                        className="btn-primary flex-1"
                    >
                        {mode === 'encrypt' ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={swapTexts}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                        title="Swap"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.button>
                </div>

                {outputText && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">Output</label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyToClipboard}
                                className="flex items-center gap-1 text-sm text-[var(--accent-primary)]"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl break-all font-mono text-sm">
                            {outputText}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default TextEncrypt;
