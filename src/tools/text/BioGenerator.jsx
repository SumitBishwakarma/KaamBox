import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

const BioGenerator = () => {
    const [platform, setPlatform] = useState('instagram');
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('');
    const [interests, setInterests] = useState('');
    const [location, setLocation] = useState('');
    const [style, setStyle] = useState('professional');
    const [generatedBios, setGeneratedBios] = useState([]);
    const [copied, setCopied] = useState(null);

    const platforms = {
        instagram: { name: 'Instagram', maxLength: 150, icon: '📸' },
        twitter: { name: 'Twitter/X', maxLength: 160, icon: '🐦' },
        linkedin: { name: 'LinkedIn', maxLength: 220, icon: '💼' },
        tiktok: { name: 'TikTok', maxLength: 80, icon: '🎵' },
        youtube: { name: 'YouTube', maxLength: 1000, icon: '📺' }
    };

    const styles = {
        professional: 'Professional',
        casual: 'Casual & Fun',
        minimal: 'Minimal',
        creative: 'Creative',
        motivational: 'Motivational'
    };

    const emojis = {
        professional: ['💼', '📊', '🎯', '✨', '🚀'],
        casual: ['😊', '🌟', '💫', '🎉', '✌️'],
        minimal: ['•', '|', '—', '/', '~'],
        creative: ['🎨', '✨', '💡', '🌈', '⚡'],
        motivational: ['💪', '🔥', '⭐', '🏆', '💎']
    };

    const templates = {
        professional: [
            `${emojis.professional[0]} {profession}\n📍 {location}\n{interests}`,
            `{name} | {profession}\n🎯 {interests}\n📍 {location}`,
            `{profession} ✨\nHelping people with {interests}\n📍 Based in {location}`,
            `💼 {profession} | {interests}\n📍 {location}\n✉️ DM for collabs`
        ],
        casual: [
            `hey, i'm {name}! 👋\n{profession} by day, {interests} enthusiast always\n📍 {location}`,
            `just a {profession} who loves {interests} 💫\n{location} 📍`,
            `{name} ✨ {profession}\nliving for {interests}\n{location} vibes 🌟`,
            `coffee + {interests} = happiness ☕\n{profession} | {location}`
        ],
        minimal: [
            `{name}\n{profession}\n{location}`,
            `{profession} • {location}`,
            `{name} | {profession}`,
            `{interests} — {location}`
        ],
        creative: [
            `🎨 {profession} painting life with {interests}\n💡 {location} dreamer\n✨ Creating magic daily`,
            `⚡ {profession} | {interests} lover\n🌈 Making the world colorful\n📍 {location}`,
            `✨ {name} ✨\n{profession} by passion\n{interests} by choice\n{location} by heart`,
            `🎭 {profession} who turns {interests} into art\n📍 {location}`
        ],
        motivational: [
            `💪 {profession} on a mission\n🔥 Passionate about {interests}\n⭐ {location} | Never give up`,
            `🏆 {profession}\n💎 Building dreams through {interests}\n🚀 {location} → World`,
            `{name} | {profession}\n💪 Hustle. Create. Inspire.\n📍 {location}`,
            `🔥 {profession} crushing goals daily\n⭐ {interests} enthusiast\n📍 {location}`
        ]
    };

    const generateBios = () => {
        const selectedTemplates = templates[style];
        const maxLen = platforms[platform].maxLength;

        const bios = selectedTemplates.map(template => {
            let bio = template
                .replace(/{name}/g, name || 'Your Name')
                .replace(/{profession}/g, profession || 'Your Profession')
                .replace(/{interests}/g, interests || 'Your Interests')
                .replace(/{location}/g, location || 'Your City');

            // Truncate if too long
            if (bio.length > maxLen) {
                bio = bio.substring(0, maxLen - 3) + '...';
            }

            return { bio, length: bio.length };
        });

        setGeneratedBios(bios);
    };

    const copyToClipboard = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">Bio Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create perfect bios for your social media profiles</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Platform</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(platforms).map(([key, p]) => (
                            <button
                                key={key}
                                onClick={() => setPlatform(key)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${platform === key ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {p.icon} {p.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Max {platforms[platform].maxLength} characters</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Profession/Role</label>
                        <input
                            type="text"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            placeholder="Software Developer"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Interests/Niche</label>
                        <input
                            type="text"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            placeholder="Tech, Photography"
                            className="input w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="New York"
                            className="input w-full"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Bio Style</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(styles).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setStyle(key)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${style === key ? 'bg-[var(--accent-primary)] text-white' : 'bg-[var(--bg-tertiary)]'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateBios}
                    className="btn-primary w-full"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Bios
                </motion.button>

                {generatedBios.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <p className="text-sm text-[var(--text-muted)]">Click to copy any bio:</p>

                        {generatedBios.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => copyToClipboard(item.bio, index)}
                                className="p-4 bg-[var(--bg-tertiary)] rounded-xl cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <pre className="whitespace-pre-wrap text-sm flex-1 font-sans">{item.bio}</pre>
                                    {copied === index ? (
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-[var(--text-muted)]">
                                    {item.length}/{platforms[platform].maxLength} characters
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BioGenerator;
