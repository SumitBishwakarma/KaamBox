import { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Lorem Ipsum word bank
const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
    'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
    'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
    'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta'
];

const generateWord = () => loremWords[Math.floor(Math.random() * loremWords.length)];

const generateSentence = (wordCount = null) => {
    const count = wordCount || Math.floor(Math.random() * 10) + 5;
    const words = Array.from({ length: count }, generateWord);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
};

const generateParagraph = (sentenceCount = null) => {
    const count = sentenceCount || Math.floor(Math.random() * 4) + 3;
    return Array.from({ length: count }, () => generateSentence()).join(' ');
};

const LoremIpsum = () => {
    const [type, setType] = useState('paragraphs');
    const [count, setCount] = useState(3);
    const [output, setOutput] = useState('');
    const [startWithLorem, setStartWithLorem] = useState(true);
    const { toast } = useToast();

    const generate = () => {
        let result = '';

        switch (type) {
            case 'paragraphs':
                result = Array.from({ length: count }, () => generateParagraph()).join('\n\n');
                break;
            case 'sentences':
                result = Array.from({ length: count }, () => generateSentence()).join(' ');
                break;
            case 'words':
                result = Array.from({ length: count }, generateWord).join(' ');
                break;
            default:
                result = '';
        }

        // Start with classic Lorem Ipsum if enabled
        if (startWithLorem && result) {
            const classicStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
            if (type === 'paragraphs' || type === 'sentences') {
                result = classicStart + result.slice(result.indexOf(' ') + 1);
            } else if (type === 'words') {
                const words = result.split(' ');
                words[0] = 'Lorem';
                if (words.length > 1) words[1] = 'ipsum';
                result = words.join(' ');
            }
        }

        setOutput(result);
        toast.success('Lorem ipsum generated!');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="space-y-6">
            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Type Selector */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Generate Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="input-field"
                    >
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                    </select>
                </div>

                {/* Count */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Count
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={count}
                        onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                        className="input-field"
                    />
                </div>

                {/* Start with Lorem */}
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-[var(--bg-tertiary)] rounded-xl w-full">
                        <input
                            type="checkbox"
                            checked={startWithLorem}
                            onChange={(e) => setStartWithLorem(e.target.checked)}
                            className="w-4 h-4 rounded border-[var(--border-color)] text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">Start with "Lorem ipsum..."</span>
                    </label>
                </div>
            </div>

            {/* Generate Button */}
            <button onClick={generate} className="btn-primary w-full">
                <RefreshCw size={20} />
                Generate Lorem Ipsum
            </button>

            {/* Output */}
            {output && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Generated Text
                        </label>
                        <button onClick={handleCopy} className="btn-secondary !py-2 !px-3 text-sm">
                            <Copy size={16} />
                            Copy
                        </button>
                    </div>
                    <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 max-h-[400px] overflow-y-auto">
                        <p className="whitespace-pre-wrap text-[var(--text-primary)]">{output}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoremIpsum;
