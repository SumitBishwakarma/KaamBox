import { useState } from 'react';
import { Copy, FlipHorizontal, FlipVertical, RotateCcw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ReverseText = () => {
    const [input, setInput] = useState('');
    const { toast } = useToast();

    const reverseString = (str) => str.split('').reverse().join('');
    const reverseWords = (str) => str.split(' ').reverse().join(' ');
    const reverseEachWord = (str) => str.split(' ').map(w => w.split('').reverse().join('')).join(' ');
    const flipVertical = (str) => {
        const flipMap = {
            'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
            'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
            'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
            'y': 'ʎ', 'z': 'z', 'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ',
            'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N',
            'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ',
            'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
            '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'",
            "'": ',', '"': '„', '`': ',', '?': '¿', '!': '¡', '[': ']', ']': '[', '(': ')',
            ')': '(', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾'
        };
        return str.split('').map(c => flipMap[c] || c).reverse().join('');
    };

    const mirrorText = (str) => {
        const mirrorMap = {
            'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ꟻ', 'g': 'ǫ', 'h': 'ʜ',
            'i': 'i', 'j': 'ꞁ', 'k': 'ʞ', 'l': 'l', 'm': 'm', 'n': 'ᴎ', 'o': 'o', 'p': 'q',
            'q': 'p', 'r': 'ɿ', 's': 'ꙅ', 't': 'ƚ', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x',
            'y': 'y', 'z': 'ƹ', 'A': 'A', 'B': 'ᙠ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ꟻ',
            'G': 'Ꭾ', 'H': 'H', 'I': 'I', 'J': 'Ⴑ', 'K': 'ꓘ', 'L': '⅃', 'M': 'M', 'N': 'И',
            'O': 'O', 'P': 'ꟼ', 'Q': 'Ọ', 'R': 'Я', 'S': 'Ꙅ', 'T': 'T', 'U': 'U', 'V': 'V',
            'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Ƹ', '1': '1', '2': '2', '3': 'Ɛ', '4': 'ᔭ',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '?': '⸮', '!': '!',
            '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<'
        };
        return str.split('').map(c => mirrorMap[c] || c).reverse().join('');
    };

    const outputs = [
        { label: 'Reverse Characters', value: reverseString(input), icon: FlipHorizontal },
        { label: 'Reverse Words', value: reverseWords(input), icon: RotateCcw },
        { label: 'Reverse Each Word', value: reverseEachWord(input), icon: FlipHorizontal },
        { label: 'Flip Upside Down', value: flipVertical(input), icon: FlipVertical },
        { label: 'Mirror Text', value: mirrorText(input), icon: FlipHorizontal }
    ];

    const copyText = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Enter Text
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type or paste text to reverse..."
                    className="textarea-field !min-h-[100px]"
                />
            </div>

            <div className="space-y-4">
                {outputs.map((item, i) => (
                    <div key={i} className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <item.icon size={16} className="text-blue-400" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            <button
                                onClick={() => copyText(item.value, item.label)}
                                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                                disabled={!input}
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <p className="font-mono text-lg break-all min-h-[28px]">
                            {item.value || <span className="text-[var(--text-muted)]">Output will appear here</span>}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReverseText;
