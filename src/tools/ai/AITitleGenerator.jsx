import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

const AITitleGenerator = () => {
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('blog');
    const [style, setStyle] = useState('engaging');
    const [titles, setTitles] = useState([]);
    const [copied, setCopied] = useState(null);
    const [generating, setGenerating] = useState(false);

    const types = [
        { id: 'blog', name: 'Blog Post', icon: '📝' },
        { id: 'youtube', name: 'YouTube Video', icon: '📺' },
        { id: 'product', name: 'Product', icon: '🛍️' },
        { id: 'headline', name: 'News Headline', icon: '📰' },
        { id: 'course', name: 'Course/Tutorial', icon: '🎓' }
    ];

    const styles = [
        { id: 'engaging', name: 'Engaging' },
        { id: 'professional', name: 'Professional' },
        { id: 'clickbait', name: 'Attention-Grabbing' },
        { id: 'seo', name: 'SEO Optimized' },
        { id: 'listicle', name: 'Listicle' }
    ];

    const patterns = {
        engaging: [
            "The Ultimate Guide to [TOPIC]",
            "[TOPIC]: Everything You Need to Know",
            "Why [TOPIC] Is Changing Everything",
            "Master [TOPIC] in Just 30 Days",
            "How [TOPIC] Can Transform Your Life",
            "The Secret to [TOPIC] Nobody Talks About",
            "[TOPIC] Made Simple: A Complete Guide",
            "Discover the Power of [TOPIC]"
        ],
        professional: [
            "[TOPIC]: A Comprehensive Analysis",
            "Understanding [TOPIC]: Key Insights and Strategies",
            "[TOPIC]: Best Practices for Success",
            "The Complete [TOPIC] Framework",
            "[TOPIC] Explained: A Professional's Guide",
            "Strategic Approaches to [TOPIC]",
            "[TOPIC]: Industry Standards and Guidelines",
            "Implementing [TOPIC] Effectively"
        ],
        clickbait: [
            "You Won't Believe What [TOPIC] Can Do! 🤯",
            "[TOPIC]: The Secret They Don't Want You to Know",
            "This [TOPIC] Trick Changed My Life!",
            "Stop Doing [TOPIC] Wrong! Here's the Right Way",
            "I Tried [TOPIC] for 30 Days - The Results Were INSANE",
            "[TOPIC] Exposed: The Truth Finally Revealed",
            "Warning: This [TOPIC] Method Is Too Powerful",
            "The [TOPIC] Hack Everyone Is Talking About"
        ],
        seo: [
            "[TOPIC]: Complete Guide [Current Year]",
            "Best [TOPIC] Tips and Strategies",
            "How to [TOPIC]: Step-by-Step Tutorial",
            "[TOPIC] for Beginners: Ultimate Guide",
            "Top [TOPIC] Methods That Actually Work",
            "[TOPIC] Explained: What, Why, and How",
            "Learn [TOPIC] Fast: Expert Tips",
            "[TOPIC] vs Alternatives: Which Is Best?"
        ],
        listicle: [
            "10 Amazing [TOPIC] Tips You Need to Know",
            "7 Secrets to Mastering [TOPIC]",
            "15 [TOPIC] Ideas That Will Inspire You",
            "5 Common [TOPIC] Mistakes to Avoid",
            "12 Ways to Improve Your [TOPIC]",
            "8 [TOPIC] Trends to Watch",
            "20 Essential [TOPIC] Tools",
            "6 [TOPIC] Strategies for Success"
        ]
    };

    const typeModifiers = {
        blog: ['How to', 'Why', 'The Complete Guide to', 'Understanding'],
        youtube: ['Watch:', 'Tutorial:', 'Review:', 'LIVE:'],
        product: ['Introducing', 'New', 'Premium', 'The Best'],
        headline: ['Breaking:', 'Exclusive:', 'Report:', 'Analysis:'],
        course: ['Learn', 'Master', 'Complete Course:', 'Bootcamp:']
    };

    const generateTitles = () => {
        if (!topic.trim()) return;

        setGenerating(true);

        setTimeout(() => {
            const currentYear = new Date().getFullYear();
            const selectedPatterns = patterns[style];
            const modifiers = typeModifiers[type];

            // Generate 8 unique titles
            const generatedTitles = selectedPatterns.map((pattern, i) => {
                let title = pattern
                    .replace(/\[TOPIC\]/g, topic.trim())
                    .replace('[Current Year]', currentYear.toString());

                // Add type modifier for some titles
                if (i % 3 === 0 && modifiers.length > 0) {
                    const modifier = modifiers[i % modifiers.length];
                    if (!title.includes(modifier)) {
                        title = `${modifier} ${title}`;
                    }
                }

                return title;
            });

            // Shuffle and take top results
            const shuffled = generatedTitles.sort(() => Math.random() - 0.5);
            setTitles(shuffled);
            setGenerating(false);
        }, 500);
    };

    const copyTitle = async (title, index) => {
        await navigator.clipboard.writeText(title);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    const regenerate = () => {
        generateTitles();
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Title Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate catchy titles for any content</p>
            </div>

            <div className="space-y-4">
                {/* Topic Input */}
                <div>
                    <label className="block text-sm font-medium mb-2">Your Topic / Subject</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Artificial Intelligence, Web Development, Healthy Eating..."
                        className="input w-full"
                    />
                </div>

                {/* Content Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">Content Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {types.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setType(t.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${type === t.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <span className="text-xl block mb-1">{t.icon}</span>
                                <span className="text-xs">{t.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title Style */}
                <div>
                    <label className="block text-sm font-medium mb-2">Title Style</label>
                    <div className="flex flex-wrap gap-2">
                        {styles.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setStyle(s.id)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${style === s.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateTitles}
                    disabled={!topic.trim() || generating}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {generating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Generate Titles
                        </>
                    )}
                </motion.button>

                {/* Generated Titles */}
                {titles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                Generated Titles ({titles.length})
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={regenerate}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate
                            </motion.button>
                        </div>
                        <div className="space-y-2">
                            {titles.map((title, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center gap-2 p-3 bg-[var(--bg-tertiary)] rounded-xl border border-pink-500/10 hover:border-pink-500/30 transition-colors"
                                >
                                    <span className="text-pink-500 font-bold text-sm w-6">{index + 1}.</span>
                                    <span className="flex-1">{title}</span>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => copyTitle(title, index)}
                                        className="p-2 rounded-lg hover:bg-[var(--bg-secondary)]"
                                    >
                                        {copied === index ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                                        )}
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AITitleGenerator;
