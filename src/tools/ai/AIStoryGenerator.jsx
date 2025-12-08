import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Copy, Check, RefreshCw, Sparkles, Shuffle } from 'lucide-react';
import { generateWithGemini } from '../../utils/geminiAPI';

const AIStoryGenerator = () => {
    const [genre, setGenre] = useState('fantasy');
    const [setting, setSetting] = useState('');
    const [character, setCharacter] = useState('');
    const [story, setStory] = useState('');
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const genres = [
        { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
        { id: 'scifi', name: 'Sci-Fi', icon: '🚀' },
        { id: 'romance', name: 'Romance', icon: '💕' },
        { id: 'mystery', name: 'Mystery', icon: '🔍' },
        { id: 'horror', name: 'Horror', icon: '👻' },
        { id: 'adventure', name: 'Adventure', icon: '⚔️' }
    ];

    const generateStory = async () => {
        setGenerating(true);
        setError('');

        const characterName = character.trim() || 'a mysterious protagonist';
        const settingPlace = setting.trim() || 'an unknown realm';

        const prompt = `Write an engaging ${genre} story opening (3-4 paragraphs) featuring ${characterName} in ${settingPlace}.

Requirements:
- Create an immersive, captivating opening
- End with a hook that makes readers want more
- Use vivid descriptions and emotional depth
- Keep it around 200-300 words
- Make it feel like the beginning of an epic tale

Only provide the story, nothing else.`;

        const result = await generateWithGemini(prompt, {
            temperature: 0.9,
            maxTokens: 1024
        });

        if (result.success) {
            setStory(result.text.trim());
        } else {
            setError(result.error || 'Failed to generate story. Please try again.');
        }

        setGenerating(false);
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(story);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-lg font-semibold mb-2">AI Story Generator</h2>
                <p className="text-[var(--text-muted)] text-sm">Create unique stories with AI</p>
            </div>

            <div className="space-y-4">
                {/* Genre Selection */}
                <div>
                    <label className="block text-sm font-medium mb-2">Choose Genre</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {genres.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setGenre(g.id)}
                                className={`p-3 rounded-xl text-center transition-colors ${genre === g.id
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-[var(--bg-tertiary)] hover:bg-pink-500/20'
                                    }`}
                            >
                                <span className="text-2xl block mb-1">{g.icon}</span>
                                <span className="text-xs">{g.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Character Name */}
                <div>
                    <label className="block text-sm font-medium mb-2">Main Character (Optional)</label>
                    <input
                        type="text"
                        value={character}
                        onChange={(e) => setCharacter(e.target.value)}
                        placeholder="e.g., Luna, a brave young warrior, Marcus the detective..."
                        className="input w-full"
                    />
                </div>

                {/* Setting */}
                <div>
                    <label className="block text-sm font-medium mb-2">Setting/Location (Optional)</label>
                    <input
                        type="text"
                        value={setting}
                        onChange={(e) => setSetting(e.target.value)}
                        placeholder="e.g., the enchanted forest, Mars colony, Victorian London..."
                        className="input w-full"
                    />
                </div>

                {/* Generate Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateStory}
                    disabled={generating}
                    className="btn-primary w-full bg-gradient-to-r from-pink-500 to-purple-500"
                >
                    {generating ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            AI Creating Story...
                        </>
                    ) : (
                        <>
                            <BookOpen className="w-4 h-4 mr-2" />
                            Generate Story with AI
                        </>
                    )}
                </motion.button>

                {/* Error */}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Generated Story */}
                {story && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-pink-500" />
                                AI Generated Story
                            </label>
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={generateStory}
                                    className="p-2 rounded-lg bg-[var(--bg-tertiary)]"
                                    title="Generate new story"
                                >
                                    <Shuffle className="w-4 h-4 text-[var(--text-muted)]" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] text-sm"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                        <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-pink-500/20">
                            <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                {story}
                            </p>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                            💡 Use this as a starting point and continue the story! • Powered by Gemini AI
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AIStoryGenerator;
