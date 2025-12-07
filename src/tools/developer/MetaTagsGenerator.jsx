import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode, Copy, Check, Download, RefreshCw } from 'lucide-react';

const MetaTagsGenerator = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState('');
    const [siteName, setSiteName] = useState('');
    const [twitterHandle, setTwitterHandle] = useState('');
    const [robots, setRobots] = useState('index, follow');
    const [copied, setCopied] = useState(false);

    const generateMetaTags = () => {
        let tags = [];

        // Basic Meta Tags
        if (title) {
            tags.push(`<title>${title}</title>`);
            tags.push(`<meta name="title" content="${title}">`);
        }
        if (description) tags.push(`<meta name="description" content="${description}">`);
        if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
        if (author) tags.push(`<meta name="author" content="${author}">`);
        tags.push(`<meta name="robots" content="${robots}">`);
        tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
        tags.push(`<meta charset="UTF-8">`);

        // Open Graph Tags
        tags.push('');
        tags.push('<!-- Open Graph / Facebook -->');
        tags.push(`<meta property="og:type" content="website">`);
        if (url) tags.push(`<meta property="og:url" content="${url}">`);
        if (title) tags.push(`<meta property="og:title" content="${title}">`);
        if (description) tags.push(`<meta property="og:description" content="${description}">`);
        if (image) tags.push(`<meta property="og:image" content="${image}">`);
        if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}">`);

        // Twitter Cards
        tags.push('');
        tags.push('<!-- Twitter -->');
        tags.push(`<meta property="twitter:card" content="summary_large_image">`);
        if (url) tags.push(`<meta property="twitter:url" content="${url}">`);
        if (title) tags.push(`<meta property="twitter:title" content="${title}">`);
        if (description) tags.push(`<meta property="twitter:description" content="${description}">`);
        if (image) tags.push(`<meta property="twitter:image" content="${image}">`);
        if (twitterHandle) tags.push(`<meta property="twitter:site" content="${twitterHandle}">`);

        return tags.join('\n');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateMetaTags());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadAsFile = () => {
        const blob = new Blob([generateMetaTags()], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'meta-tags.html';
        link.click();
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Meta Tags Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate SEO meta tags for your website</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Page Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My Awesome Website"
                            maxLength={60}
                            className="input w-full"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-1">{title.length}/60 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Site Name</label>
                        <input
                            type="text"
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                            placeholder="My Brand"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A brief description of your page..."
                        maxLength={160}
                        className="input w-full h-20 resize-none"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">{description.length}/160 characters</p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Keywords</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                        className="input w-full"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Page URL</label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Image URL</label>
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="John Doe"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Twitter Handle</label>
                        <input
                            type="text"
                            value={twitterHandle}
                            onChange={(e) => setTwitterHandle(e.target.value)}
                            placeholder="@username"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Robots</label>
                    <select
                        value={robots}
                        onChange={(e) => setRobots(e.target.value)}
                        className="input w-full"
                    >
                        <option value="index, follow">Index, Follow (Default)</option>
                        <option value="noindex, follow">No Index, Follow</option>
                        <option value="index, nofollow">Index, No Follow</option>
                        <option value="noindex, nofollow">No Index, No Follow</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        className="btn-primary flex-1"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy Tags'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadAsFile}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <Download className="w-5 h-5" />
                    </motion.button>
                </div>

                <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm font-medium mb-2">Generated Meta Tags:</p>
                    <pre className="text-xs text-green-400 overflow-x-auto whitespace-pre-wrap font-mono">
                        {generateMetaTags()}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default MetaTagsGenerator;
