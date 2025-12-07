import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Copy, Check, Download, RefreshCw } from 'lucide-react';

const AsciiArtGenerator = () => {
    const [text, setText] = useState('');
    const [style, setStyle] = useState('standard');
    const [copied, setCopied] = useState(false);

    const styles = [
        { id: 'standard', name: 'Standard' },
        { id: 'block', name: 'Block' },
        { id: 'banner', name: 'Banner' },
        { id: 'simple', name: 'Simple' }
    ];

    const fonts = {
        standard: {
            'A': ['  ___  ', ' / _ \\ ', '/ /_\\ \\', '|  _  |', '|_| |_|'],
            'B': ['____  ', '| __ ) ', '|  _ \\ ', '| |_) |', '|____/ '],
            'C': [' ____ ', '/ ___|', '| |   ', '| |___', ' \\____|'],
            'D': ['____  ', '|  _ \\ ', '| | | |', '| |_| |', '|____/ '],
            'E': [' _____ ', '| ____|', '|  _|  ', '| |___ ', '|_____|'],
            'F': [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
            'G': [' ____ ', '/ ___|', '| |  _ ', '| |_| |', ' \\____|'],
            'H': ['_   _ ', '| | | |', '| |_| |', '|  _  |', '|_| |_|'],
            'I': [' ___ ', '|_ _|', ' | | ', ' | | ', '|___|'],
            'J': ['     _ ', '    | |', ' _  | |', '| |_| |', ' \\___/ '],
            'K': ['_  __', '| |/ /', '| \' / ', '| . \\ ', '|_|\\_\\'],
            'L': ['_     ', '| |    ', '| |    ', '| |___ ', '|_____|'],
            'M': ['__  __ ', '|  \\/  |', '| |\\/| |', '| |  | |', '|_|  |_|'],
            'N': ['_   _ ', '| \\ | |', '|  \\| |', '| |\\  |', '|_| \\_|'],
            'O': [' ___  ', '/ _ \\ ', '| | | |', '| |_| |', ' \\___/ '],
            'P': ['____  ', '|  _ \\ ', '| |_) |', '|  __/ ', '|_|    '],
            'Q': [' ___  ', '/ _ \\ ', '| | | |', '| |_| |', ' \\__\\_\\'],
            'R': ['____  ', '|  _ \\ ', '| |_) |', '|  _ < ', '|_| \\_\\'],
            'S': [' ____  ', '/ ___| ', '\\___ \\ ', ' ___) |', '|____/ '],
            'T': [' _____ ', '|_   _|', '  | |  ', '  | |  ', '  |_|  '],
            'U': ['_   _ ', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
            'V': ['__     __', '\\ \\   / /', ' \\ \\ / / ', '  \\ V /  ', '   \\_/   '],
            'W': ['__        __', '\\ \\      / /', ' \\ \\ /\\ / / ', '  \\ V  V /  ', '   \\_/\\_/   '],
            'X': ['__  __', '\\ \\/ /', ' \\  / ', ' /  \\ ', '/_/\\_\\'],
            'Y': ['__   __', '\\ \\ / /', ' \\ V / ', '  | |  ', '  |_|  '],
            'Z': [' _____', '|__  /', '  / / ', ' / /_ ', '/____|'],
            ' ': ['   ', '   ', '   ', '   ', '   '],
            '!': [' _ ', '| |', '| |', '|_|', '(_)'],
            '?': [' ___ ', '|__ \\', '  / /', ' |_| ', ' (_) ']
        }
    };

    const generateAsciiArt = () => {
        if (!text) return '';

        const upperText = text.toUpperCase();
        const font = fonts.standard;
        const lines = ['', '', '', '', ''];

        for (const char of upperText) {
            const charArt = font[char] || font[' '];
            for (let i = 0; i < 5; i++) {
                lines[i] += charArt[i] || '   ';
            }
        }

        return lines.join('\n');
    };

    const simpleBlock = (text) => {
        const chars = text.toUpperCase().split('');
        const top = '╔' + '═'.repeat(text.length * 4 + 2) + '╗';
        const middle = '║ ' + chars.map(c => ` ${c} `).join('') + ' ║';
        const bottom = '╚' + '═'.repeat(text.length * 4 + 2) + '╝';
        return [top, middle, bottom].join('\n');
    };

    const banner = (text) => {
        const border = '#'.repeat(text.length + 6);
        return `${border}\n#  ${text.toUpperCase()}  #\n${border}`;
    };

    const getAsciiArt = () => {
        if (!text) return 'Enter text above...';

        switch (style) {
            case 'block':
                return simpleBlock(text);
            case 'banner':
                return banner(text);
            case 'simple':
                return text.toUpperCase().split('').join(' ');
            default:
                return generateAsciiArt();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(getAsciiArt());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">ASCII Art Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Convert text to ASCII art</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Enter Text</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value.slice(0, 20))}
                        placeholder="Type something..."
                        maxLength={20}
                        className="input w-full text-lg"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">{text.length}/20 characters</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Style</label>
                    <div className="flex flex-wrap gap-2">
                        {styles.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setStyle(s.id)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${style === s.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl overflow-x-auto">
                    <pre className="font-mono text-sm text-green-400 whitespace-pre">
                        {getAsciiArt()}
                    </pre>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyToClipboard}
                    className="btn-primary w-full"
                >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy ASCII Art'}
                </motion.button>
            </div>
        </div>
    );
};

export default AsciiArtGenerator;
