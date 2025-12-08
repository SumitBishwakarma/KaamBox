import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Copy, Check, RefreshCw, Sparkles } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AITitleGenerator = () => {
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('blog');
    const [style, setStyle] = useState('engaging');
    const [titles, setTitles] = useState([]);
    const [copied, setCopied] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

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

    const generateTitles = async () => {
        if (!topic.trim()) return;

        setGenerating(true);
        setError('');

        const prompt = `Generate 8 ${style} titles for a ${type} about "${topic}".

Style guide:
- engaging: Make it compelling and curiosity-driving
- professional: Corporate and business-appropriate
- clickbait: Attention-grabbing, use power words (Warning: You Won't Believe...)
- seo: Include keywords, optimized for search (include year ${new Date().getFullYear()})
- listicle: Number-based lists (10 Ways..., 7 Secrets...)

Format: Return each title on a new line, numbered 1-8. Only provide the titles, nothing else.`;

        const result = await generateWithGemini(prompt, { temperature: 0.8 });

        if (result.success) {
            // Parse titles from response
            const generatedTitles = result.text
                .split('\n')
                .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
                .filter(line => line.length > 5);
            setTitles(generatedTitles.slice(0, 8));
        } else {
            setError(result.error || 'Failed to generate titles. Please try again.');
        }

        setGenerating(false);
    };

    const copyTitle = async (title, index) => {
        await navigator.clipboard.writeText(title);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Title Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Generate catchy titles with AI</p>
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
                            AI Generating...
                        </>
                    ) : (
                        <>
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Generate Titles with AI
                        </>
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

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
                                AI Generated Titles ({titles.length})
                            </label>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generateTitles}
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
                        <p className="text-xs text-[var(--text-muted)]">
                            Powered by Gemini AI
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AITitleGenerator;
