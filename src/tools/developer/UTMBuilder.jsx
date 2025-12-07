import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, Check, ExternalLink, Trash2 } from 'lucide-react';

const UTMBuilder = () => {
    const [baseUrl, setBaseUrl] = useState('');
    const [utmSource, setUtmSource] = useState('');
    const [utmMedium, setUtmMedium] = useState('');
    const [utmCampaign, setUtmCampaign] = useState('');
    const [utmTerm, setUtmTerm] = useState('');
    const [utmContent, setUtmContent] = useState('');
    const [copied, setCopied] = useState(false);

    const presets = [
        { name: 'Email', source: 'email', medium: 'email', campaign: 'newsletter' },
        { name: 'Social - Facebook', source: 'facebook', medium: 'social', campaign: 'organic_post' },
        { name: 'Social - Twitter', source: 'twitter', medium: 'social', campaign: 'tweet' },
        { name: 'Social - LinkedIn', source: 'linkedin', medium: 'social', campaign: 'post' },
        { name: 'Google Ads', source: 'google', medium: 'cpc', campaign: 'ads' },
        { name: 'Facebook Ads', source: 'facebook', medium: 'cpc', campaign: 'ads' }
    ];

    const buildUrl = () => {
        if (!baseUrl) return '';

        let url = baseUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            const urlObj = new URL(url);

            if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
            if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
            if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
            if (utmTerm) urlObj.searchParams.set('utm_term', utmTerm);
            if (utmContent) urlObj.searchParams.set('utm_content', utmContent);

            return urlObj.toString();
        } catch {
            return '';
        }
    };

    const generatedUrl = buildUrl();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyPreset = (preset) => {
        setUtmSource(preset.source);
        setUtmMedium(preset.medium);
        setUtmCampaign(preset.campaign);
    };

    const clearAll = () => {
        setBaseUrl('');
        setUtmSource('');
        setUtmMedium('');
        setUtmCampaign('');
        setUtmTerm('');
        setUtmContent('');
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">UTM Builder</h2>
                <p className="text-[var(--text-muted)] text-sm">Create tracking URLs for campaigns</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Quick Presets</label>
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <button
                                key={p.name}
                                onClick={() => applyPreset(p)}
                                className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-secondary)]"
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Website URL *</label>
                    <input
                        type="url"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://example.com/page"
                        className="input w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Source *</label>
                        <input
                            type="text"
                            value={utmSource}
                            onChange={(e) => setUtmSource(e.target.value)}
                            placeholder="google, facebook, newsletter"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Medium *</label>
                        <input
                            type="text"
                            value={utmMedium}
                            onChange={(e) => setUtmMedium(e.target.value)}
                            placeholder="cpc, email, social"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Campaign *</label>
                    <input
                        type="text"
                        value={utmCampaign}
                        onChange={(e) => setUtmCampaign(e.target.value)}
                        placeholder="summer_sale, product_launch"
                        className="input w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Term (optional)</label>
                        <input
                            type="text"
                            value={utmTerm}
                            onChange={(e) => setUtmTerm(e.target.value)}
                            placeholder="keywords"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Content (optional)</label>
                        <input
                            type="text"
                            value={utmContent}
                            onChange={(e) => setUtmContent(e.target.value)}
                            placeholder="banner_ad, text_link"
                            className="input w-full"
                        />
                    </div>
                </div>

                {generatedUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-[var(--bg-tertiary)] rounded-xl"
                    >
                        <p className="text-xs text-[var(--text-muted)] mb-2">Generated URL:</p>
                        <p className="text-sm font-mono text-green-400 break-all">{generatedUrl}</p>
                    </motion.div>
                )}

                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyToClipboard}
                        disabled={!generatedUrl}
                        className="btn-primary flex-1"
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy URL'}
                    </motion.button>
                    {generatedUrl && (
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={generatedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </motion.a>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={clearAll}
                        className="p-3 rounded-xl bg-[var(--bg-tertiary)]"
                    >
                        <Trash2 className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default UTMBuilder;
