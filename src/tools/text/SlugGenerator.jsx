import { useState } from 'react';
import { Copy, Link } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SlugGenerator = () => {
    const [input, setInput] = useState('');
    const [separator, setSeparator] = useState('-');
    const [lowercase, setLowercase] = useState(true);
    const [removeNumbers, setRemoveNumbers] = useState(false);
    const [maxLength, setMaxLength] = useState(0);
    const { toast } = useToast();

    const generateSlug = () => {
        let slug = input
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s-]/g, '') // Remove special chars
            .trim();

        if (removeNumbers) {
            slug = slug.replace(/[0-9]/g, '');
        }

        slug = slug.replace(/[\s_]+/g, separator);
        slug = slug.replace(new RegExp(`${separator}+`, 'g'), separator);

        if (lowercase) {
            slug = slug.toLowerCase();
        }

        if (maxLength > 0) {
            slug = slug.substring(0, maxLength);
            // Remove trailing separator
            if (slug.endsWith(separator)) {
                slug = slug.slice(0, -1);
            }
        }

        return slug;
    };

    const slug = generateSlug();

    const copySlug = () => {
        navigator.clipboard.writeText(slug);
        toast.success('Slug copied to clipboard');
    };

    const previewUrl = `https://example.com/${slug || 'your-slug-here'}`;

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Enter Title or Text
                </label>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., My Awesome Blog Post!"
                    className="input-field"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Separator
                    </label>
                    <select
                        value={separator}
                        onChange={(e) => setSeparator(e.target.value)}
                        className="input-field"
                    >
                        <option value="-">Hyphen (-)</option>
                        <option value="_">Underscore (_)</option>
                        <option value="">None</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Max Length (0 = unlimited)
                    </label>
                    <input
                        type="number"
                        value={maxLength}
                        onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
                        min="0"
                        className="input-field"
                    />
                </div>

                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lowercase}
                            onChange={(e) => setLowercase(e.target.checked)}
                            className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-sm">Lowercase</span>
                    </label>
                </div>

                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={removeNumbers}
                            onChange={(e) => setRemoveNumbers(e.target.checked)}
                            className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-sm">Remove Numbers</span>
                    </label>
                </div>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Generated Slug</span>
                    <button
                        onClick={copySlug}
                        className="btn-secondary !py-1.5 !px-3"
                        disabled={!slug}
                    >
                        <Copy size={16} />
                        Copy
                    </button>
                </div>
                <p className="font-mono text-xl text-blue-400 break-all">
                    {slug || 'your-slug-will-appear-here'}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                    {slug.length} characters
                </p>
            </div>

            <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                    <Link size={16} className="text-green-400" />
                    <span className="text-sm font-medium text-[var(--text-secondary)]">URL Preview</span>
                </div>
                <p className="font-mono text-sm text-green-400 break-all">
                    {previewUrl}
                </p>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <h4 className="font-medium mb-2">SEO Tips</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                    <li>• Keep slugs short and descriptive (50-60 characters max)</li>
                    <li>• Use hyphens to separate words</li>
                    <li>• Include your main keyword</li>
                    <li>• Avoid stop words (a, the, is, etc.) when possible</li>
                </ul>
            </div>
        </div>
    );
};

export default SlugGenerator;
