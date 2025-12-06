import { useState } from 'react';
import { Copy, Minimize2, Trash2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const CSSMinifier = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState(null);
    const [removeComments, setRemoveComments] = useState(true);
    const { toast } = useToast();

    const minifyCSS = () => {
        if (!input.trim()) {
            toast.warning('Please enter CSS code');
            return;
        }

        let css = input;
        const originalSize = css.length;

        // Remove comments
        if (removeComments) {
            css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        }

        // Remove whitespace
        css = css
            .replace(/\s+/g, ' ')           // Multiple spaces to single
            .replace(/\s*{\s*/g, '{')       // Around {
            .replace(/\s*}\s*/g, '}')       // Around }
            .replace(/\s*;\s*/g, ';')       // Around ;
            .replace(/\s*:\s*/g, ':')       // Around :
            .replace(/\s*,\s*/g, ',')       // Around ,
            .replace(/;}/g, '}')            // Remove last semicolon
            .replace(/^\s+|\s+$/g, '')      // Trim start/end
            .replace(/\n/g, '');            // Remove newlines

        setOutput(css);

        const minifiedSize = css.length;
        const savedBytes = originalSize - minifiedSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

        setStats({
            original: originalSize,
            minified: minifiedSize,
            saved: savedBytes,
            percent: savedPercent
        });

        toast.success(`Minified! Saved ${savedPercent}%`);
    };

    const beautifyCSS = () => {
        if (!input.trim()) {
            toast.warning('Please enter CSS code');
            return;
        }

        let css = input
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/\s*}\s*/g, '\n}\n\n')
            .replace(/;\s*/g, ';\n  ')
            .replace(/,\s*/g, ',\n')
            .replace(/\n\s*\n/g, '\n')
            .replace(/{\s*\n\s*}/g, '{ }')
            .trim();

        setOutput(css);
        toast.success('CSS beautified');
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast.success('Copied to clipboard');
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setStats(null);
    };

    const sampleCSS = `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* Header styles */
.header {
  background-color: #3b82f6;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.button:hover {
  transform: scale(1.05);
}`;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-[var(--text-secondary)]">
                            Input CSS
                        </label>
                        <button
                            onClick={() => setInput(sampleCSS)}
                            className="text-xs text-blue-400 hover:underline"
                        >
                            Load Sample
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your CSS code here..."
                        className="textarea-field !min-h-[300px] font-mono text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Output
                    </label>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Minified/Beautified CSS will appear here..."
                        className="textarea-field !min-h-[300px] font-mono text-sm bg-[var(--bg-tertiary)]"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={removeComments}
                        onChange={(e) => setRemoveComments(e.target.checked)}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-sm">Remove Comments</span>
                </label>
            </div>

            <div className="flex flex-wrap gap-3">
                <button onClick={minifyCSS} className="btn-primary">
                    <Minimize2 size={18} />
                    Minify
                </button>
                <button onClick={beautifyCSS} className="btn-secondary">
                    Beautify
                </button>
                <button onClick={copyOutput} className="btn-secondary" disabled={!output}>
                    <Copy size={18} />
                    Copy
                </button>
                <button onClick={clearAll} className="btn-secondary">
                    <Trash2 size={18} />
                    Clear
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-blue-400">{stats.original}</p>
                        <p className="text-sm text-[var(--text-muted)]">Original (bytes)</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-green-400">{stats.minified}</p>
                        <p className="text-sm text-[var(--text-muted)]">Minified (bytes)</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-purple-400">{stats.saved}</p>
                        <p className="text-sm text-[var(--text-muted)]">Saved (bytes)</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl text-center">
                        <p className="text-2xl font-bold text-orange-400">{stats.percent}%</p>
                        <p className="text-sm text-[var(--text-muted)]">Reduction</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CSSMinifier;
