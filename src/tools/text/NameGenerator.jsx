import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check, RefreshCw } from 'lucide-react';

const NameGenerator = () => {
    const [type, setType] = useState('business');
    const [keywords, setKeywords] = useState('');
    const [results, setResults] = useState([]);
    const [copied, setCopied] = useState(null);

    const types = [
        { id: 'business', name: 'Business', icon: '🏢' },
        { id: 'startup', name: 'Startup', icon: '🚀' },
        { id: 'app', name: 'App Name', icon: '📱' },
        { id: 'username', name: 'Username', icon: '👤' },
        { id: 'brand', name: 'Brand', icon: '✨' },
        { id: 'domain', name: 'Domain', icon: '🌐' }
    ];

    const prefixes = {
        business: ['Pro', 'Prime', 'Elite', 'Global', 'Smart', 'Advanced', 'Premium', 'Core'],
        startup: ['Tech', 'Neo', 'Next', 'Inno', 'Digi', 'Cloud', 'Byte', 'Cyber'],
        app: ['My', 'Easy', 'Quick', 'Super', 'Ultra', 'Pocket', 'Smart', 'Fast'],
        username: ['The', 'Real', 'Official', 'True', 'Pro', 'Epic', 'King', 'Master'],
        brand: ['Luna', 'Nova', 'Stella', 'Aura', 'Zen', 'Pure', 'Luxe', 'Royal'],
        domain: ['Get', 'Try', 'Use', 'Go', 'My', 'The', 'Hey', 'Join']
    };

    const suffixes = {
        business: ['Solutions', 'Group', 'Hub', 'Labs', 'Works', 'Co', 'Inc', 'Plus'],
        startup: ['ly', 'io', 'ify', 'Hub', 'Labs', 'Base', 'Tech', 'AI'],
        app: ['Go', 'Now', 'Pro', 'Plus', 'Mate', 'Buddy', 'Helper', 'Hub'],
        username: ['_Official', '_Pro', '123', '_Real', 'HD', '_XO', 'VIP', '_'],
        brand: ['Co', 'Studio', 'Collective', 'House', 'Lab', 'Works', '', 'Design'],
        domain: ['.com', '.io', '.co', '.app', '.ai', '.tech', '.me', '.dev']
    };

    const generateNames = () => {
        const keyword = keywords.trim() || 'Tech';
        const results = [];
        const usedPrefixes = prefixes[type];
        const usedSuffixes = suffixes[type];

        // Pure keyword variations
        results.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));

        // Prefix + Keyword
        for (let i = 0; i < 4; i++) {
            const prefix = usedPrefixes[Math.floor(Math.random() * usedPrefixes.length)];
            results.push(prefix + keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }

        // Keyword + Suffix
        for (let i = 0; i < 4; i++) {
            const suffix = usedSuffixes[Math.floor(Math.random() * usedSuffixes.length)];
            results.push(keyword.charAt(0).toUpperCase() + keyword.slice(1) + suffix);
        }

        // Prefix + Keyword + Suffix
        for (let i = 0; i < 3; i++) {
            const prefix = usedPrefixes[Math.floor(Math.random() * usedPrefixes.length)];
            const suffix = usedSuffixes[Math.floor(Math.random() * usedSuffixes.length)];
            results.push(prefix + keyword.charAt(0).toUpperCase() + keyword.slice(1) + suffix);
        }

        // Unique names
        const uniqueResults = [...new Set(results)];
        setResults(uniqueResults.slice(0, 12));
    };

    const copyName = (name, index) => {
        navigator.clipboard.writeText(name);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Name Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate creative names for your projects</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                        {types.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${type === t.id ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <span className="text-xl">{t.icon}</span>
                                <p className="text-xs mt-1">{t.name}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Keyword</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Enter a word (e.g., cloud, music, shop)"
                        className="input w-full"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateNames}
                    className="btn-primary w-full"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Names
                </motion.button>

                {results.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {results.map((name, i) => (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => copyName(name, i)}
                                className={`p-3 rounded-xl text-left transition-colors ${copied === i ? 'bg-green-500/20' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{name}</span>
                                    {copied === i ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NameGenerator;
